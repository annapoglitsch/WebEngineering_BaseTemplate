import { useState, type FormEvent, type JSX } from 'react';
import './App.css';

interface Comment {
  id: number;
  author: string;
  text: string;
}

interface Bear {
  type: string;
  coat: string;
  adultSize: string;
  habitat: string;
  lifespan: string;
  diet: string;
}

const bears: Bear[] = [
  {
    type: 'Wild',
    coat: 'Brown or black',
    adultSize: '1.4 to 2.8 meters',
    habitat: 'Woods and forests',
    lifespan: '25 to 28 years',
    diet: 'Fish, meat, plants',
  },
  {
    type: 'Urban',
    coat: 'North Face',
    adultSize: '18 to 22 meters',
    habitat: 'Condos and coffee shops',
    lifespan: '20 to 32 years',
    diet: 'Starbucks, sushi',
  },
];

function App(): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Bob Fossil',
      text: 'Oh I am so glad you taught me all about the big brown angry guys...',
    },
  ]);

  const [showComments, setShowComments] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (name.trim() === '' || comment.trim() === '') {
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      author: name,
      text: comment,
    };

    setComments([...comments, newComment]);
    setName('');
    setComment('');
  }

  return (
    <>
      <header>
        <h1>Welcome to our wildlife website</h1>
      </header>

      <nav>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Our team</a>
          </li>
          <li>
            <a href="#">Projects</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
        </ul>

        <form className="search">
          <input type="search" name="q" placeholder="Search for wildlife" />
          <input type="submit" value="Search" />
        </form>
      </nav>

      <main>
        <article>
          <h2>The trouble with Bears</h2>

          <p>By Evan Wild</p>

          <p>
            Tall, lumbering, angry, dangerous. The real live bears of this world
            are proud, independent creatures, self-serving and always on the
            hunt for food.
          </p>

          <h2>Types of bear</h2>

          <table>
            <caption>Comparison of Bear Types</caption>

            <thead>
              <tr>
                <th>Bear Type</th>
                <th>Coat</th>
                <th>Adult size</th>
                <th>Habitat</th>
                <th>Lifespan</th>
                <th>Diet</th>
              </tr>
            </thead>

            <tbody>
              {bears.map((bear) => (
                <tr key={bear.type}>
                  <td>{bear.type}</td>
                  <td>{bear.coat}</td>
                  <td>{bear.adultSize}</td>
                  <td>{bear.habitat}</td>
                  <td>{bear.lifespan}</td>
                  <td>{bear.diet}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Habitats and Eating habits</h2>

          <p>
            Wild bears eat a variety of meat, fish, fruit, nuts, and other
            naturally growing ingredients...
          </p>

          <img src="/media/wild-bear.jpg" alt="Wild bear in forest" />

          <p>
            Urban (gentrified) bears on the other hand have largely abandoned
            the old ways...
          </p>

          <img src="/media/urban-bear.jpg" alt="Urban bear near buildings" />

          <h2>Mating rituals</h2>

          <p>Bears are romantic creatures by nature...</p>

          <audio controls>
            <source src="/media/bear.mp3" type="audio/mpeg" />
            <source src="/media/bear.ogg" type="audio/ogg" />
            <p>
              It looks like your browser doesn't support HTML5 audio players.
            </p>
          </audio>

          <aside>
            <h2>About the author</h2>
            <p>Evan Wild is an unemployed plumber from Doncaster...</p>
          </aside>

          <section className="comments">
            <button
              type="button"
              className="show-hide"
              onClick={() => {
                setShowComments(!showComments);
              }}
            >
              {showComments ? 'Hide comments' : 'Show comments'}
            </button>

            {showComments && (
              <div className="comment-wrapper">
                <h2>Add comment</h2>

                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <div className="flex-pair">
                    <label htmlFor="name">Your name:</label>

                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                  </div>

                  <div className="flex-pair">
                    <label htmlFor="comment">Your comment:</label>

                    <input
                      type="text"
                      name="comment"
                      id="comment"
                      placeholder="Enter your comment"
                      value={comment}
                      onChange={(event) => {
                        setComment(event.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <button type="submit" className="comment-submit">
                      Comment
                    </button>
                  </div>
                </form>

                <h2>Comments</h2>

                <ul className="comment-container">
                  {comments.map((comment) => (
                    <li key={comment.id}>
                      <p>{comment.author}</p>
                      <p>{comment.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="more-bears">
            <h2>More Bears</h2>
          </section>
        </article>

        <div className="secondary">
          <h2>Related</h2>

          <ul>
            <li>
              <a href="#">The trouble with Bees</a>
            </li>
            <li>
              <a href="#">The trouble with Otters</a>
            </li>
            <li>
              <a href="#">The trouble with Penguins</a>
            </li>
            <li>
              <a href="#">The trouble with Octopi</a>
            </li>
            <li>
              <a href="#">The trouble with Lemurs</a>
            </li>
          </ul>
        </div>
      </main>

      <footer>
        <p>©Copyright 2050 by nobody. All rights reversed.</p>
      </footer>
    </>
  );
}

export default App;
