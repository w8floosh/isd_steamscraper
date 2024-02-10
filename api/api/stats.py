# def achievement_score(message):
#     while True:


#     owned = get_owned_games(
#         userid, key=request.args.get("key"), include_played_free_games=1
#     )

#     for game in json.loads(owned.data).response.games:
#         message.payload_set(
#             game.appid, get_game_user_stats(userid, appid=game.appid).achievements
#         )

#     # publish message to Redis
#     # redisclient.publish("calc_req", message)

#     # consume result
#     # result = redisclient.consume("calc_res")

#     # return result
