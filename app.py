from flask import Flask, session, request, render_template, jsonify, flash
from flask_debugtoolbar import DebugToolbarExtension
# from boggle import boggle_game
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def home_page():
    """
    Home page shows a form to choose how big the board is
    """
    return render_template("game_size.html")

@app.route('/boggle-game', methods=["POST"])
def start_game():
    # get the game size value 
    size = request.form["board-size"]
    # change string -> integer
    size = int(size)
    # store value in session
    session['size'] = size
    board = boggle_game.make_board(size)
    session['board'] = board
    highscore = session.get("highscore", 0)
    games_played = session.get("games_played", 0)

    return render_template("start_game.html", board=board, 
                            highscore=highscore, 
                            games_played=games_played)

# @app.route('/')
# def start_game():
#     board = boggle_game.make_board()
#     session['board'] = board
#     highscore = session.get("highscore", 0)
#     games_played = session.get("games_played", 0)

#     return render_template("start_game.html", board=board, 
#                             highscore=highscore, 
#                             games_played=games_played)

# Next, make sure that the word is valid on the board using the check_valid_word function from the boggle.py file.
# @app.route('/check-guess')
# def check_guess():
#     """
#     Checks to make sure that the word is valid on the board using the check_valid_word function from the boggle.py file.
#     """
#     guess = request.args["guess"]
#     board = session['board']
#     response = boggle_game.check_valid_word(board, guess)

#     # Send a JSON response which contains either a dictionary of {“result”: “ok”}, {“result”: “not-on-board”}, or {“result”: “not-a-word”}, so the front-end can provide slightly different messages depending if the word is valid or not.
#     return jsonify({'result': response})

@app.route('/check-guess')
def check_guess():
    """
    Checks to make sure that the word is valid on the board using the check_valid_word function from the boggle.py file.
    """
    size = session['size']
    guess = request.args["guess"]
    board = session['board']
    response = boggle_game.check_valid_word(board, guess, size)

    # Send a JSON response which contains either a dictionary of {“result”: “ok”}, {“result”: “not-on-board”}, or {“result”: “not-a-word”}, so the front-end can provide slightly different messages depending if the word is valid or not.
    return jsonify({'result': response})

@app.route('/post-score', methods=['POST'])
def post_score():
    """
    Posts the highest score of the player onto DOM
    """
    score = request.json['score']

    # get highscore and nplays from session if not stored start with 0
    highscore = session.get("highscore", 0)
    games_played = session.get("games_played", 0)

    session['games_played'] = games_played + 1
    session['highscore'] = max(score, highscore)

    return jsonify({'brokeRecord': score > highscore})







