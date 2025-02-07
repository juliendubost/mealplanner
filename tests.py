from models import Meal, Tag, TagMeal, get_session
from sqlmodel import select


def add_data():

    sn = get_session()
    for name in ["soir", "midi", "végé", "emporter"]:
        if not sn.get(Tag, name):
            sn.add(Tag(name=name))

    sn.commit()

    for name in ["Poulet frites", "Couscous végé"]:
        if not sn.get(Meal, name):
            sn.add(Meal(name=name))

    sn.commit()

    # tags for couscous végé

    for tag_data in [
        ("soir", "Couscous végé"),
        ("midi", "Couscous végé"),
        ("emporter", "Couscous végé"),
        ("végé", "Couscous végé"),
        ("midi", "Poulet frites"),
        ("soir", "Poulet frites"),
    ]:
        tag, meal = tag_data
        statement = select(TagMeal).where(TagMeal.tag == tag, TagMeal.meal == meal)
        if not sn.exec(statement).all():
            sn.add(TagMeal(tag=tag, meal=meal))

    sn.commit()
