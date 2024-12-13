import React, { useContext, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

// Context
import { AtlasContext } from '../../__root';
import { InformationContext } from '../../information';

// Data
import useAnarachistLibrary from '../../../data/information/nexus/useAnarachistLibrary';

// Lemmy
import { CommentView, LemmyHttp, PostView, Search } from 'lemmy-js-client';
import Comment from '../../../components/lemmy/Comment';
import Post from '../../../components/lemmy/Post';

export const Route = createFileRoute('/information/nexus/anarchistlibrary')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activeAdministrativeRegion, activeGeographicIdentifier } =
    useContext(AtlasContext);

  const {
    activeLemmyInstance,
    activeCommunity,
    activeListingType,
    activeSortType,
  } = useContext(InformationContext);
  const { anarchistLibraryPosts, isLoading } = useAnarachistLibrary(
    activeAdministrativeRegion,
    activeGeographicIdentifier,
  );

  function HexBearNews({ bulletin }) {
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    function getHexbear(anarchistLibrary) {
      const client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
      const form: Search = {
        community_id: activeCommunity?.counts?.community_id,
        type_: 'All',
        listing_type: 'All',
        sort: 'TopAll',
        q: anarchistLibrary.author,
        page: 1,
      };

      client.search(form).then((res) => {
        setComments([]);
        setPosts([]);

        if (comments && res?.comments) setComments(res?.comments);
        if (posts && res?.posts) setPosts(res?.posts);
        setIsLoaded(true);
      });
    }

    return (
      <div className="anarchist-library-community">
        {!isLoaded && (
          <p
            className="reply-button"
            role="button"
            tabIndex={0}
            aria-label="Show Replies"
            onClick={() => getHexbear(bulletin)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                () => getHexbear(bulletin);
              }
            }}
          >
            <span className="post-replycount-emoji">💬</span> Search Author on
            hexbear.net
          </p>
        )}
        {posts.length > 0 && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={index}
                  post={post}
                  community={activeCommunity}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        {comments.length > 0 &&
          comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                community={activeCommunity}
                post={comment}
                lemmyInstance={activeLemmyInstance}
                sort={activeSortType}
                ratioDetector={comment?.counts.score}
                isOpen={false}
              />
            );
          })}
      </div>
    );
  }

  return (
    <div id="legend-content">
      <h3>Anarchist Library</h3>
      <a
        href={`https://theanarchistlibrary.org/search?query=${encodeURI(
          activeAdministrativeRegion[activeGeographicIdentifier],
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📚📕 Books about{' '}
        {activeAdministrativeRegion.country != 'country' &&
          activeAdministrativeRegion[activeGeographicIdentifier]}
      </a>

      {isLoading && <p className="search-loading-emoji">🔍</p>}

      {anarchistLibraryPosts?.length > 0 && (
        <>
          {anarchistLibraryPosts &&
            anarchistLibraryPosts.map((book, index) => {
              return (
                <div className="anarchist-library-item" key={index}>
                  <p className="anarchist-library-publish-date ">
                    🗓️ {new Date(book.pubdate_iso).toDateString()}
                  </p>
                  <h4 className="anarchist-library-link">{book.title}</h4>
                  {book.author && (
                    <p className="anarchist-library-author highlight">
                      👤 {book.author}
                    </p>
                  )}
                  {book.subtitle && <p>ℹ️ {book.subtitle}</p>}
                  {book.feed_teaser && (
                    <details>
                      <summary className="view-more">Show More</summary>
                      <div
                        dangerouslySetInnerHTML={{ __html: book.feed_teaser }}
                      ></div>
                    </details>
                  )}
                  <div className="anarchist-library-container">
                    <a
                      className="anarchist-library-readmore"
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read {book.text_type}
                    </a>
                    {book.pages_estimated && (
                      <span>~{book.pages_estimated} 📄</span>
                    )}
                  </div>
                  <HexBearNews bulletin={book} />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
