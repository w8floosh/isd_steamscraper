def extract_query(key, *route, **kwargs):
    query = ""
    if bool(route):
        for param in route:
            query = "/".join([query, param])
    if not bool(kwargs):
        return query

    query += "?"
    if bool(key):
        query += f"key={key}"

    args = ""
    for arg, value in kwargs.items():
        if value is not None:
            args = "&".join([args, f"{arg}={value}"])

    return "".join([query, args])


def check_response(response, error=None):
    json = response.json()
    return build_response(json, response.status_code, error)


def build_response(body: dict, status_code, error):
    if status_code == 200:
        body["success"] = True
    else:
        # If the request was not successful, you might want to handle the error appropriately
        body["success"] = False
        body["error"] = f"{status_code}:{error} "

    return body
