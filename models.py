from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, ForeignKey, select

DB_FILE = "cookplaner.db"


####################
# many 2 many models
####################
class TagMeal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tag: str = ForeignKey("tag.name")
    meal: str = ForeignKey("meal.name")
####################


class Tag(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)


class Meal(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)
    description: Optional[str]
    url: Optional[str]


def get_engine():
    return create_engine(f"sqlite:///{DB_FILE}")


def get_session():
    return Session(get_engine())


def create_tables():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)


def get_all(model):
    """
    Shortcut method to get all instances of a model
    use select(Model).where(Model.colname == value) to filter
    """
    # TODO: use async session when sqlmodel is documented
    session = get_session()
    statement = select(model)
    return session.exec(statement).all()
