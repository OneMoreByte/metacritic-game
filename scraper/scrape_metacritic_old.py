import logging
import time
import os
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup


@dataclass
class Game:
    id: int 
    title: str 
    description: str 
    cover_img: str 
    platform: str 
    critic_str: str 
    metacritic_score: str 
    esrb_rating: str 
    game_url: str 


class MetacriticScraper:
    def __init__(self, db_user: str, db_pass: str, db_host: str):
        self.base_url = "https://www.metacritic.com"
        # Metacritic rejects the requests User-Agent for some reason (probably abuse). We'll lie so it lets us in (and we'll be gentle :) )
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
        }
        self.db_user = db_user
        self.db_pass = db_pass
        self.db_host = db_host

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

    def get_games_paginated(self, page_num: int) -> list[Game]:
        games = []
        url = f"{self.base_url}/browse/game/?releaseYearMin=1958&releaseYearMax=2024"
        page = requests.get(url + f"&page={page_num}", headers=self.headers)
        if page.status_code != 200:
            logging.error("got bad response code from metacritic")
            raise RuntimeError
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
                games.append(
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
                )
        return games

    def get_max_page(self) -> int:
        """Parses the bottom of the first results page to get the maximum number of pages"""
        url = f"{self.base_url}/browse/game/?releaseYearMin=1958&releaseYearMax=2024"
        page = requests.get(url, headers=self.headers)
        if page.status_code != 200:
            logging.error("got bad response code from metacritic")
            raise RuntimeError
        soup = BeautifulSoup(page.content, "html.parser")
        pages_span = soup.find("span", class_="c-navigationPagination_pages")
        pages = int(pages_span.contents[-1].text.strip())
        logging.info(f"Found {pages} pages to parse")
        return pages

    def run(self):
        page_end = self.get_max_page()
        for i in range(page_end):
            self.get_games_paginated(i)


if __name__ == "__main__":
    db_user = os.getenv("SQL_USER", "")
    db_pass = os.getenv("SQL_PASS", "")
    db_host = os.getenv("SQL_HOST", "")
    MetacriticScraper(db_user, db_pass, db_host).run()
