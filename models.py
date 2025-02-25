from typing import Optional
import json

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


def load_meals(json_file_path):
    js_data = json.load(open(json_file_path))
    sn = get_session()

    for meal_data in js_data:
        tags_inst = []
        for tag in meal_data["tags"]:
            tag_inst = sn.get(Tag, tag)
            if not tag_inst:
                sn.add(Tag(name=tag))
                tag_inst = sn.get(Tag, tag)
            tags_inst.append(tag_inst)

        meal_inst = sn.get(Meal, meal_data["name"])
        if not meal_inst:
            sn.add(
                Meal(
                    name=meal_data["name"],
                    description=meal_data.get("description", ""),
                    url=meal_data.get("url", ""),
                )
            )
            meal_inst = sn.get(Meal, meal_data["name"])

        for tag_inst in tags_inst:
            meal_tag_inst = sn.execute(
                select(TagMeal).where(
                    TagMeal.tag == tag_inst.name, TagMeal.meal == meal_inst.name
                )
            ).first()
            if not meal_tag_inst:
                sn.add(TagMeal(tag=tag_inst.name, meal=meal_inst.name))

    sn.commit()
