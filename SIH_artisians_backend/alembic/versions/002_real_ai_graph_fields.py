"""Add processed image metadata and graph evidence to matches."""

from alembic import op
import sqlalchemy as sa

revision = "002_real_ai_graph_fields"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    image_columns = {column["name"] for column in inspector.get_columns("product_images")}
    match_columns = {column["name"] for column in inspector.get_columns("matches")}
    if "processed_path" not in image_columns:
        op.add_column("product_images", sa.Column("processed_path", sa.String(length=500), nullable=True))
    if "processing_metadata" not in image_columns:
        op.add_column("product_images", sa.Column("processing_metadata", sa.JSON(), nullable=True))
    if "graph_evidence" not in match_columns:
        op.add_column("matches", sa.Column("graph_evidence", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("matches", "graph_evidence")
    op.drop_column("product_images", "processing_metadata")
    op.drop_column("product_images", "processed_path")
