from bs4 import BeautifulSoup
import requests
import logging
from dataclasses import dataclass


@dataclass
class Game:
    id: str
    title: str
    description: str
    cover_img: str
    platform: str
    critic_str: str
    metacritic_score: str
    esrb_rating: str
    game_url: str


class MetacriticScraper:
    def __init__(self):
        self.base_url = "https://www.metacritic.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
        }

    def get_systems(self, href: str) -> list[tuple[str, str, str]]:
        page = requests.get(self.base_url + href, headers=self.headers)
        soup = BeautifulSoup(page.content, "html.parser")
        platforms = soup.find_all("a", class_="c-gamePlatformTile")
        data = []
        for p in platforms:
            critic_str = p.find("p").text.strip()
            critic_score = p.find(class_="c-siteReviewScore").text.strip()
            platform = p.attrs["href"].rsplit("=", 1)[-1]
            data.append((critic_str, critic_score, platform))
        return data

    def get_games_paginated(self, page_num: int):
        url = f"{self.base_url}/browse/game/?releaseYearMin=1958&releaseYearMax=2024&platform=pc&platform=ps5&platform=xbox-series-x&platform=nintendo-switch&platform=mobile&platform=3ds&platform=dreamcast&platform=ds&platform=gba&platform=gamecube&platform=meta-quest&platform=nintendo-64&platform=ps1&platform=ps2&platform=xbox-one&platform=xbox-360&platform=xbox&platform=wii-u&platform=wii&platform=ps-vita&platform=psp&platform=ps3&platform=ps4"
        page = requests.get(url + f"&page={page_num}", headers=self.headers)
        soup = BeautifulSoup(page.content, "html.parser")
        results = soup.find_all("div", class_="c-finderProductCard-game")
        logging.warning(f"looking at {len(results)} items")
        for r in results:
            page = r.find("a").attrs["href"]
            rating = r.find(class_="u-text-capitalize").parent.text.strip()
            description = (
                r.find(class_="c-finderProductCard_description")
                .contents[0]
                .text.strip()
            )
            title = (
                r.find(class_="c-finderProductCard_titleHeading")
                .contents[-1]
                .text.strip()
            )
            cover = r.find(class_="c-finderProductCard_img").find("img").attrs["src"]
            platforms = self.get_systems(page)
            for critic_str, critic_score, platform in platforms:
                Game(
                    id=page + platform,
                    title=title,
                    description=description,
                    cover_img=cover,
                    platform=platform,
                    critic_str=critic_str,
                    metacritic_score=critic_score,
                    esrb_rating=rating,
                    game_url=self.base_url + page,
                )
