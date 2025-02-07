#######################
#  Starlette views here
#######################

from starlette.applications import Starlette
from starlette.responses import JSONResponse, RedirectResponse
from starlette.routing import Route
from models import Meal, TagMeal, Tag, get_session, get_all
from sqlmodel import func, or_, select


def handle_params(request):
    """
    read request.query_string and return list of query params

    request.query_string="tag=toto,tata"
    will return
    {"tag": ["toto", "tata"]}
    """
    if request.query_string:
        key, value = request.query_string.split("=")
        values = value.split(",")
        return {key: values}

    return {}


async def homepage(request):
    return RedirectResponse("/meal/")


async def meals(request):

    tags = handle_params(request).get("tags", [])
    if tags:
        select(TagMeal, func.count(TagMeal.meal, label="count")).where(
            or_(TagMeal.tag == "midi", TagMeal.tag == "végé")).group_by(TagMeal.meal).having(
            func.count(TagMeal.meal) >= 2)  # TODO: relace with correct cond

    else:
        results = get_all(TagMeal)



    return JSONResponse([dict(result.meal) for result in results])


async def tags(request):

    return JSONResponse([dict(result) for result in get_all(Tag)])


app = Starlette(debug=True, routes=[
    Route('/', homepage),
    Route('/meal/', meals),
    Route('/tag/', tags),
])
