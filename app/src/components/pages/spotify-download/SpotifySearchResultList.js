import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => (
  <div>
    <div className='columns is-multiline'>
      {props.list.map(playlist => (
        <div className="column is-one-quarter" key={playlist.id}>
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by4">
                <img src={playlist.image} alt={playlist.image} />
              </figure>
            </div>
            <div className="card-content has-text-centered">
              <div className="content ">
                <h3>{playlist.name}</h3>
              </div>
            </div>
            <footer className="card-footer">
              <p className="card-footer-item">
                <Link to={`/spotify-download/playlist/${playlist.userId}/${playlist.id}`}><i className='fa fa-download' /> Download</Link>
              </p>
            </footer>
          </div>
        </div>
      ))}
    </div>
  </div>
)
