import { type JSX, useEffect, useState } from 'react';
import './App.css';

import { SearchForm } from './components/search/SearchForm';
import { BearSection } from './components/bear/BearSection';
import { CommentSection } from './components/comments/CommentSection';
import { BearDetails } from './components/bear/BearDetail';
import { highlightText } from './components/search/HighlightText.tsx';

function App(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = (): void => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const params = new URLSearchParams(window.location.search);
  const urlSearchTerm = params.get('search') ?? '';

  function handleSearch(value: string): void {
    setSearchTerm(value);

    const params = new URLSearchParams(window.location.search);

    if (value !== '') {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    const query = params.toString();

    window.history.pushState(
      {},
      '',
      `${window.location.pathname}${query !== '' ? `?${query}` : ''}`
    );

    setPath(window.location.pathname);
  }

  if (path === '/bears') {
    return (
      <>
        <a href="/">← Back to Home</a>
        <h1>Our Bears</h1>

        <SearchForm onSearch={handleSearch} />

        <BearSection
          searchTerm={urlSearchTerm !== '' ? urlSearchTerm : searchTerm}
        />
      </>
    );
  }

  if (path.startsWith('/bears/')) {
    const id = decodeURIComponent(path.substring('/bears/'.length));

    return (
      <>
        <h1>Bear Details</h1>

        <BearDetails bearId={id} />
      </>
    );
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

        <SearchForm onSearch={setSearchTerm} />
      </nav>

      <main>
        <article>
          <h2>{highlightText('The trouble with Bears', searchTerm)}</h2>

          <p>{highlightText('By Evan Wild', searchTerm)}</p>

          <p>
            {highlightText(
              'Tall, lumbering, angry, dangerous. The real live bears of this\n' +
                '              world are proud, independent creatures, self-serving and always\n' +
                '              on the hunt for food.',
              searchTerm
            )}
          </p>

          <h2>{highlightText('Types of bear', searchTerm)}</h2>

          <table>
            <caption>
              {highlightText('Comparison of Bear Types', searchTerm)}
            </caption>

            <thead>
              <tr>
                <th>{highlightText('Bear Type', searchTerm)}</th>
                <th>{highlightText('Coat', searchTerm)}</th>
                <th>{highlightText('Adult size', searchTerm)}</th>
                <th>{highlightText('Habitat', searchTerm)}</th>
                <th>{highlightText('Lifespan', searchTerm)}</th>
                <th>{highlightText('Diet', searchTerm)}</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{highlightText('Wild', searchTerm)}</td>
                <td>{highlightText('Brown or black', searchTerm)}</td>
                <td>{highlightText('1.4 to 2.8 meters', searchTerm)}</td>
                <td>{highlightText('Woods and forests', searchTerm)}</td>
                <td>{highlightText('25 to 28 years', searchTerm)}</td>
                <td>{highlightText('Fish, meat, plants', searchTerm)}</td>
              </tr>

              <tr>
                <td>{highlightText('Urban', searchTerm)}</td>
                <td>{highlightText('North Face', searchTerm)}</td>
                <td>{highlightText('18 to 22 meters', searchTerm)}</td>
                <td>{highlightText('Condos and coffee shops', searchTerm)}</td>
                <td>{highlightText('20 to 32 years', searchTerm)}</td>
                <td>{highlightText('Starbucks, sushi', searchTerm)}</td>
              </tr>
            </tbody>
          </table>

          <h2>{highlightText('Habitats and Eating habits', searchTerm)}</h2>

          <p>
            {highlightText(
              'Wild bears eat a variety of meat, fish, fruit, nuts, and other\n' +
                '              naturally growing ingredients...',
              searchTerm
            )}
          </p>

          <img src="/media/wild-bear.jpg" alt="Wild bear in forest" />

          <p>
            {highlightText(
              'Urban (gentrified) bears on the other hand have largely abandoned\n' +
                '              the old ways...',
              searchTerm
            )}
          </p>

          <img src="/media/urban-bear.jpg" alt="Urban bear near buildings" />

          <h2>{highlightText('Mating rituals', searchTerm)}</h2>

          <p>
            {highlightText(
              'Bears are romantic creatures by nature...',
              searchTerm
            )}
          </p>

          <audio controls>
            <source src="../public/media/bear.mp3" type="audio/mpeg" />
            <source src="/media/bear.ogg" type="audio/ogg" />
            <p>
              {highlightText(
                "It looks like your browser doesn't support HTML5 audio players.",
                searchTerm
              )}
            </p>
          </audio>

          <aside>
            <h2>{highlightText('About the author', searchTerm)}</h2>
            <p>
              {highlightText(
                'Evan Wild is an unemployed plumber from Doncaster...',
                searchTerm
              )}
            </p>
          </aside>

          <CommentSection searchTerm={searchTerm} />
          <BearSection searchTerm={searchTerm} />
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
