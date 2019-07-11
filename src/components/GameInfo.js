import React from 'react'
import './GameInfo.scss'

class GameInfo extends React.Component {

  onClickScrollChevron = () => {
    window.scrollTo({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  render() {
    return (
      <div className='game-info'>
        <h3>Controls</h3>
        <ul>
          <li>W, S, A, D: Move</li>
          <li>Shift: Attack</li>
          <li>Click in game to enable mouse-look, then use escape key to disable mouse-look</li>
          <li>When mouse look is enabled, click to attack</li>
        </ul>

        <h3>Credits - 2D, 3D, font assets</h3>
        <ul>
          <li><a href='https://opengameart.org/content/seamless-industrial-textures'>https://opengameart.org/content/seamless-industrial-textures</a></li>
          <li><a href='https://opengameart.org/content/concrete-wall-grey-with-water-marks-512px'>https://opengameart.org/content/concrete-wall-grey-with-water-marks-512px</a></li>
          <li><a href='https://opengameart.org/content/concrete-tiles'>https://opengameart.org/content/concrete-tiles</a></li>
          <li><a href='https://opengameart.org/content/paving-mossy-stones-seamless-texture-with-normalmap'>https://opengameart.org/content/paving-mossy-stones-seamless-texture-with-normalmap</a></li>
          <li><a href='https://sketchfab.com/3d-models/model-d00m-1-shotgun-200ed3469c024e4e991fabb6eb200869'>'https://sketchfab.com/3d-models/model-d00m-1-shotgun-200ed3469c024e4e991fabb6eb200869</a></li>
          <li><a href='https://sketchfab.com/3d-models/sentry-chaingun-4e3a944d7ffe4307b70f47b399e4b7e7'>https://sketchfab.com/3d-models/sentry-chaingun-4e3a944d7ffe4307b70f47b399e4b7e7</a></li>
          <li><a href='https://sketchfab.com/3d-models/puckle-1718-af6aa8bdecbb470a88b029118b915549'>'https://sketchfab.com/3d-models/model-d00m-1-shotgun-200ed3469c024e4e991fabb6eb200869</a></li>
          <li><a href='https://opengameart.org/content/5x-special-effects-2d'>https://opengameart.org/content/5x-special-effects-2d</a></li>
          <li><a href='https://opengameart.org/content/gloomy-skybox'>https://opengameart.org/content/gloomy-skybox</a></li>
          <li><a href='https://opengameart.org/content/red-eclipse-skyboxes'>https://opengameart.org/content/red-eclipse-skyboxes</a></li>
          <li><a href='https://opengameart.org/content/xonotic-skyboxes'>https://opengameart.org/content/xonotic-skyboxes</a></li>
          <li><a href='http://www.textures4photoshop.com/tex/metal/'>http://www.textures4photoshop.com/tex/metal/</a></li>
          <li><a href='https://soundimage.org/txr-sci-fi/'>https://soundimage.org/txr-sci-fi/</a></li>
          <li><a href='http://terminal26.de/'>http://terminal26.de/</a></li>
          <li><a href='https://www.1001fonts.com/velekom-font.html'>https://www.1001fonts.com/velekom-font.html</a></li>
          <li><a href='https://www.1001fonts.com/surgeon-font.html'>https://www.1001fonts.com/surgeon-font.html</a></li>
          <li><a href='https://www.1001fonts.com/terminal-grotesque-font.html'>https://www.1001fonts.com/terminal-grotesque-font.html</a></li>
          <li><a href='https://www.1001fonts.com/exepixelperfect-font.html'>https://www.1001fonts.com/exepixelperfect-font.html</a></li>
        </ul>

        <div
          className='scroll-chevron'
          onClick={this.onClickScrollChevron}
        >
          &lt;
        </div>
      </div>
    )
  }
}

export default GameInfo