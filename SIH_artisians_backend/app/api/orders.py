from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Order, OrderEvent, OrderItem
from app.schemas import OrderCreate, OrderOut, OrderStatusUpdate
from app.services.utils import new_id
from app.services.graph_service import graph_service

router = APIRouter(prefix="/orders", tags=["orders"])

TRANSITIONS = {
    "MATCHED": {"ACCEPTED", "REJECTED", "CANCELLED"},
    "ACCEPTED": {"RESERVED", "REJECTED", "CANCELLED"},
    "RESERVED": {"PRODUCTION", "CANCELLED"},
    "PRODUCTION": {"QC", "FAILED", "CANCELLED"},
    "QC": {"DISPATCHED", "FAILED"},
    "DISPATCHED": {"DELIVERED", "FAILED"},
    "DELIVERED": {"COMPLETED", "FAILED"},
    "COMPLETED": set(), "REJECTED": set(), "CANCELLED": set(), "FAILED": set(),
}


@router.post("", response_model=OrderOut, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    order = Order(id=payload.id or new_id("ORD"), requirement_id=payload.requirement_id, buyer_name=payload.buyer_name, total_quantity=payload.total_quantity, is_demo_data=payload.is_demo_data, state="MATCHED")
    db.add(order)
    for item in payload.items:
        if not item.get("artisan_id") or not item.get("quantity"):
            raise HTTPException(422, "Each order item needs artisan_id and quantity")
        db.add(OrderItem(id=new_id("ITEM"), order_id=order.id, artisan_id=item["artisan_id"], quantity=int(item["quantity"])))
    db.add(OrderEvent(id=new_id("EVT"), order_id=order.id, to_state="MATCHED", note="Order created", actor="system"))
    db.commit()
    db.refresh(order)
    graph_service.sync_order(order)
    return order


@router.get("", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db)) -> list[Order]:
    return list(db.scalars(select(Order).order_by(Order.created_at.desc())))


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db)) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: str, payload: OrderStatusUpdate, db: Session = Depends(get_db)) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    target = payload.state.upper()
    if target not in TRANSITIONS or target not in TRANSITIONS[order.state]:
        raise HTTPException(409, f"Invalid order transition {order.state} -> {target}")
    previous = order.state
    order.state = target
    db.add(OrderEvent(id=new_id("EVT"), order_id=order.id, from_state=previous, to_state=target, note=payload.note, actor=payload.actor))
    db.commit()
    db.refresh(order)
    return order
