from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def initial(self):
        """
        Initial Setup
        """

        self.client = app.test_client()
        # Make Flask errors be real errors, not HTML pages with error info
        app.config['TESTING'] = True

        # This is a bit of hack, but don't use Flask DebugToolbar
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_start_game(self):
        with app.test_client() as client:
            response = client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('games_played'))
            self.assertIn(b'Best Score: <b class="best-score">', response.data)
            self.assertIn(b'Games Played: <b class="games-played">', response.data)
            self.assertIn(b'Time: <b class="countdown">', response.data)
    
    def test_check_guess(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] =  [["D", "O", "G", "H", "I"], 
                                            ["C", "A", "T", "J", "K"], 
                                            ["C", "A", "N", "M", "L"], 
                                            ["C", "A", "O", "P", "Q"], 
                                            ["V", "U", "T", "S", "R"]]
                        
            response = client.get('/check-guess?guess=cat')
            self.assertEqual(response.json['result'], 'ok')

            response = client.get('/check-guess?guess=hat')
            self.assertNotEqual(response.json['result'], 'ok')

            response = client.get('/check-guess?guess=abcdefghj')
            self.assertEqual(response.json['result'], 'not-word')








