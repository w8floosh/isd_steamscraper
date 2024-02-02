import requests, json
from datetime import datetime, timezone
from flask import Blueprint, request
from ..utils import SteamWebAPI, SteamworksAPI, check_response, header_configuration

api = Blueprint("economy", __name__, url_prefix="/economy")
_trading = Blueprint("trading", __name__, url_prefix="/trading")


@api.route("/assets/<id>/prices", methods=["GET"])
def get_asset_prices(id):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.ECONOMY.value,
                "GetAssetPrices",
                "0001",
                request.args.get("key"),
                appid=id,
                count=request.args.get("count"),
                language=request.args.get("language", "english"),
            ),
            headers=header_configuration,
        )
    )


@_trading.route("/history", methods=["GET"])
def get_trade_history():
    input = {
        "max_trades": request.args.get("max_trades", 50),
        "start_after_time": request.args.get(
            "start_after_time", datetime.now(timezone.utc)
        ),
        "start_after_tradeid": request.args.get("start_after_tradeid", 1),
        "navigating_back": request.args.get("navigating_back", "false"),
        "get_descriptions": request.args.get("get_descriptions", "true"),
        "language": request.args.get("language", "en"),
        "include_failed": request.args.get("include_failed", "false"),
        "include_total": request.args.get("include_total", "true"),
    }
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.ECONOMY.value,
                "GetTradeHistory",
                "0001",
                request.args.get("key"),
                input_json=json.dumps(input),
            )
        )
    )


@_trading.route("/offers/<id>", methods=["GET"])
def get_trade_offer(id):
    input = {"tradeofferid": id, "language": request.args.get("language", "en")}
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.ECONOMY.value,
                "GetTradeOffer",
                "0001",
                request.args.get("key"),
                input_json=json.dumps(input),
            )
        )
    )


@_trading.route("/offers", methods=["GET"])
def get_trade_offers():
    input = {
        "get_sent_offers": request.args.get("get_sent_offers", "true"),
        "get_received_offers": request.args.get("get_received_offers", "true"),
        "get_descriptions": request.args.get("get_descriptions", "true"),
        "language": request.args.get("language", "en"),
        "active_only": request.args.get("active_only", "true"),
        "historical_only": request.args.get("historical_only", "false"),
        "time_historical_cutoff": request.args.get("time_historical_cutoff", 0),
    }
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.ECONOMY.value,
                "GetTradeOffers",
                "0001",
                request.args.get("key"),
                input_json=json.dumps(input),
            )
        )
    )


api.register_blueprint(_trading)
