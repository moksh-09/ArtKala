from __future__ import annotations

import logging
from contextlib import contextmanager
from typing import Any, Iterator

from app.config import get_settings

logger = logging.getLogger(__name__)


class GraphService:
    """Neo4j Community adapter; never fabricates graph data when unavailable."""

    def __init__(self) -> None:
        self._driver: Any = None

    def _get_driver(self) -> Any:
        settings = get_settings()
        if not settings.graph_enabled:
            return None
        if self._driver is None:
            try:
                from neo4j import GraphDatabase
            except ImportError:
                return None
            self._driver = GraphDatabase.driver(settings.neo4j_uri, auth=(settings.neo4j_username, settings.neo4j_password))
        return self._driver

    def status(self) -> dict[str, Any]:
        settings = get_settings()
        if not settings.graph_enabled:
            return {"graph_available": False, "configured": False, "fallback": "relational"}
        driver = self._get_driver()
        if driver is None:
            return {"graph_available": False, "configured": True, "reason": "neo4j_driver_not_installed", "fallback": "relational"}
        try:
            driver.verify_connectivity()
            return {"graph_available": True, "configured": True, "database": settings.neo4j_database}
        except Exception as exc:
            return {"graph_available": False, "configured": True, "reason": str(exc), "fallback": "relational"}

    @contextmanager
    def _session(self) -> Iterator[Any]:
        driver = self._get_driver()
        if driver is None:
            raise RuntimeError("Graph database is unavailable")
        settings = get_settings()
        with driver.session(database=settings.neo4j_database) as session:
            yield session

    def _write(self, query: str, **params: Any) -> bool:
        if not self.status().get("graph_available"):
            return False
        try:
            with self._session() as session:
                session.run(query, **params).consume()
            return True
        except Exception:
            logger.exception("Neo4j synchronization failed")
            return False

    def sync_artisan(self, artisan: Any) -> bool:
        query = """
        MERGE (a:Artisan {id: $id}) SET a.name=$name, a.craft=$craft, a.state=$state, a.district=$district, a.verification_status=$verification_status, a.is_demo_data=$is_demo_data
        MERGE (c:Craft {name: $craft})
        MERGE (a)-[:PRACTICES]->(c)
        FOREACH (cluster_id IN CASE WHEN $cluster_id IS NULL THEN [] ELSE [$cluster_id] END |
          MERGE (cl:Cluster {id: cluster_id}) MERGE (a)-[:BELONGS_TO]->(cl))
        """
        return self._write(query, id=artisan.id, name=artisan.name, craft=artisan.craft, state=artisan.state, district=artisan.district, verification_status=artisan.verification_status, is_demo_data=artisan.is_demo_data, cluster_id=artisan.cluster_id)

    def sync_product(self, product: Any) -> bool:
        query = """
        MERGE (p:Product {id: $id}) SET p.name=$name, p.category=$category, p.status=$status, p.ai_confirmed=$ai_confirmed, p.is_demo_data=$is_demo_data
        MERGE (a:Artisan {id: $artisan_id}) MERGE (a)-[:MAKES]->(p)
        FOREACH (craft IN CASE WHEN $craft IS NULL THEN [] ELSE [$craft] END |
          MERGE (c:Craft {name: craft}) MERGE (p)-[:MADE_USING]->(c))
        FOREACH (material IN CASE WHEN $material IS NULL THEN [] ELSE [$material] END |
          MERGE (m:Material {name: material}) MERGE (p)-[:USES_MATERIAL]->(m))
        FOREACH (category IN CASE WHEN $category IS NULL THEN [] ELSE [$category] END |
          MERGE (cat:Category {name: category}) MERGE (p)-[:BELONGS_TO]->(cat))
        """
        return self._write(query, id=product.id, name=product.name, artisan_id=product.artisan_id, craft=product.craft, material=product.material, category=product.category, status=product.status, ai_confirmed=product.ai_confirmed, is_demo_data=product.is_demo_data)

    def sync_capability(self, capability: Any) -> bool:
        query = """
        MERGE (a:Artisan {id: $artisan_id})
        MERGE (c:Capability {id: $id}) SET c.attribute=$attribute, c.value=$value, c.source=$source, c.verification_status=$verification_status, c.confidence=$confidence, c.observed_at=$observed_at, c.evidence_ref=$evidence_ref
        MERGE (a)-[:HAS_CAPABILITY]->(c)
        """
        return self._write(query, id=capability.id, artisan_id=capability.artisan_id, attribute=capability.attribute, value=str(capability.value), source=capability.source, verification_status=capability.verification_status, confidence=capability.confidence, observed_at=capability.observed_at.isoformat(), evidence_ref=capability.evidence_ref)

    def sync_requirement(self, requirement: Any) -> bool:
        query = """
        MERGE (r:BuyerRequirement {id: $id}) SET r.product=$product, r.quantity=$quantity, r.deadline_days=$deadline_days, r.max_price=$max_price, r.is_demo_data=$is_demo_data
        FOREACH (craft IN CASE WHEN $craft IS NULL THEN [] ELSE [$craft] END |
          MERGE (c:Craft {name: craft}) MERGE (r)-[:REQUIRES_CRAFT]->(c))
        MERGE (p:ProductType {name: $product}) MERGE (r)-[:REQUIRES_PRODUCT_TYPE]->(p)
        """
        return self._write(query, id=requirement.id, product=requirement.product, quantity=requirement.quantity, deadline_days=requirement.deadline_days, max_price=requirement.max_price, craft=requirement.craft, is_demo_data=requirement.is_demo_data)

    def sync_order(self, order: Any) -> bool:
        query = """
        MERGE (o:Order {id: $id}) SET o.state=$state, o.total_quantity=$total_quantity, o.is_demo_data=$is_demo_data
        MERGE (b:Buyer {name: $buyer_name}) MERGE (b)-[:PLACED]->(o)
        FOREACH (item IN $items |
          MERGE (a:Artisan {id: item.artisan_id})
          MERGE (o)-[f:FULFILLED_BY]->(a)
          SET f.quantity = item.quantity)
        """
        return self._write(query, id=order.id, state=order.state, total_quantity=order.total_quantity, buyer_name=order.buyer_name, is_demo_data=order.is_demo_data, items=[{"artisan_id": item.artisan_id, "quantity": item.quantity} for item in getattr(order, "items", [])])

    def sync_quality(self, quality: Any) -> bool:
        query = """
        MERGE (q:QCRecord {id: $id}) SET q.result=$result, q.checker=$checker, q.observations=$observations, q.specification_compliance=$specification_compliance, q.created_at=$created_at
        MERGE (o:Order {id: $order_id}) MERGE (a:Artisan {id: $artisan_id}) MERGE (o)-[:HAS_QC]->(q) MERGE (a)-[:HAS_EVIDENCE]->(q)
        """
        return self._write(query, id=quality.id, result=quality.result, checker=quality.checker, observations=quality.observations, specification_compliance=quality.specification_compliance, created_at=quality.created_at.isoformat(), order_id=quality.order_id, artisan_id=quality.artisan_id)

    def artisan_graph(self, artisan_id: str) -> dict[str, Any]:
        if not self.status().get("graph_available"):
            return {"graph_available": False, "fallback": "relational"}
        query = """
        MATCH p=(a:Artisan {id: $artisan_id})-[rels*1..3]-(n)
        RETURN [node IN nodes(p) | {id: coalesce(node.id, node.name), type: labels(node)[0], properties: properties(node)}] AS nodes,
               [rel IN relationships(p) | {type: type(rel), from: startNode(rel).id, to: coalesce(endNode(rel).id, endNode(rel).name)}] AS relationships
        LIMIT 100
        """
        return self._read_paths(query, artisan_id=artisan_id)

    def product_relations(self, product_id: str) -> dict[str, Any]:
        if not self.status().get("graph_available"):
            return {"graph_available": False, "fallback": "relational"}
        query = """
        MATCH p=(product:Product {id: $product_id})-[rels*1..3]-(n)
        RETURN [node IN nodes(p) | {id: coalesce(node.id, node.name), type: labels(node)[0], properties: properties(node)}] AS nodes,
               [rel IN relationships(p) | {type: type(rel), from: startNode(rel).id, to: coalesce(endNode(rel).id, endNode(rel).name)}] AS relationships
        LIMIT 100
        """
        return self._read_paths(query, product_id=product_id)

    def match_evidence(self, requirement_id: str, artisan_id: str) -> list[dict[str, Any]]:
        if not self.status().get("graph_available"):
            return []

    def requirement_matches(self, requirement_id: str) -> dict[str, Any]:
        if not self.status().get("graph_available"):
            return {"graph_available": False, "fallback": "relational"}
        query = """
        MATCH p=(r:BuyerRequirement {id: $requirement_id})-[rels*1..6]-(a:Artisan)
        RETURN a.id AS artisan_id,
               [node IN nodes(p) | coalesce(node.id, node.name)] AS node_path,
               [rel IN relationships(p) | type(rel)] AS relationship_path
        LIMIT 200
        """
        try:
            with self._session() as session:
                rows = [{"artisan_id": record["artisan_id"], "node_path": record["node_path"], "relationship_path": record["relationship_path"]} for record in session.run(query, requirement_id=requirement_id)]
            return {"graph_available": True, "matches": rows}
        except Exception as exc:
            logger.exception("Neo4j requirement query failed")
            return {"graph_available": False, "fallback": "relational", "reason": str(exc)}

    def evidence_provenance(self, evidence_id: str) -> dict[str, Any]:
        if not self.status().get("graph_available"):
            return {"graph_available": False, "fallback": "relational"}
        query = """
        MATCH p=(e)-[rels*1..4]-(n)
        WHERE (e:Capability OR e:QCRecord) AND e.id=$evidence_id
        RETURN [node IN nodes(p) | {id: coalesce(node.id, node.name), type: labels(node)[0], properties: properties(node)}] AS nodes,
               [rel IN relationships(p) | {type: type(rel), from: startNode(rel).id, to: coalesce(endNode(rel).id, endNode(rel).name)}] AS relationships
        LIMIT 100
        """
        return self._read_paths(query, evidence_id=evidence_id)
        query = """
        MATCH p=(r:BuyerRequirement {id: $requirement_id})-[rels*1..5]-(a:Artisan {id: $artisan_id})
        RETURN [node IN nodes(p) | coalesce(node.id, node.name)] AS node_path,
               [rel IN relationships(p) | type(rel)] AS relationship_path
        LIMIT 5
        """
        try:
            with self._session() as session:
                return [{"node_path": record["node_path"], "relationship_path": record["relationship_path"]} for record in session.run(query, requirement_id=requirement_id, artisan_id=artisan_id)]
        except Exception:
            logger.exception("Neo4j evidence query failed")
            return []

    def _read_paths(self, query: str, **params: Any) -> dict[str, Any]:
        try:
            with self._session() as session:
                paths = [{"nodes": record["nodes"], "relationships": record["relationships"]} for record in session.run(query, **params)]
            return {"graph_available": True, "paths": paths}
        except Exception as exc:
            logger.exception("Neo4j read failed")
            return {"graph_available": False, "fallback": "relational", "reason": str(exc)}


graph_service = GraphService()
