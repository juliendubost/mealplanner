#######################
#  Starlette views here
#######################

import operator
import random
from urllib.parse import unquote

from starlette.applications import Starlette
from starlette.responses import JSONResponse, RedirectResponse
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from models import Meal, TagMeal, Tag, get_session, get_all
from sqlmodel import func, or_, select, text


def handle_params(request):
    """
    read request.query_string and return list of query params

    request.query_string="tag=toto,tata"
    will return
    {"tag": ["toto", "tata"]}
    """
    query_string = unquote(request.scope["query_string"])
    if query_string:
        ret = {}
        query_items = query_string.split("&")
        for query_item in query_items:
            key, value = query_item.split("=")
            values = value.split(",")
            ret[key] = values
        return ret

    return {}


async def homepage(request):
    return RedirectResponse("/meal/")


async def meals(request):
    """
    return a shuffled list of meals as JSON in the form:
    [
      {
        "tag":"soir",
        "id":1,
        "meal":"Couscous végétarien"
      },
      {
        "tag":"midi",
        "id":25,
        "meal":"Poulet basquaise"
      }
    ]

    NB: each meal payload only include one tag, not all tags for each meal

    query params:
      - tags: list of tags to filter meals on, each meal must have all given tags to be selected
      - count: number of meals to be returned
    """

    handled_params = handle_params(request)
    tags = handled_params.get("tags", [])
    count = handled_params.get("count")

    if tags:
        tag_args = [text(f"TagMeal.tag=='{value}'") for value in tags]
        statement = (
            select(TagMeal)
            .where(or_(*tag_args))
            .group_by(TagMeal.meal)
            .having(func.count(TagMeal.meal) >= len(tag_args))
        )

    else:
        statement = select(TagMeal).group_by(TagMeal.meal)

    results = [dict(result) for result in get_session().exec(statement).all()]
    random.shuffle(results)

    if count:
        results = results[: int(count[0])]

    return JSONResponse([dict(result) for result in results])


async def tags(request):

    return JSONResponse([dict(result) for result in get_all(Tag)])


middlewares = [Middleware(CORSMiddleware, allow_origins=["*"])]

app = Starlette(
    debug=True,
    routes=[
        Route("/", homepage),
        Route("/meal/", meals),
        Route("/tag/", tags),
    ],
    middleware=middlewares,
)
