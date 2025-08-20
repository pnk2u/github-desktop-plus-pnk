import * as React from 'react'
import { ICommonImageDiffProperties } from './modified-image-diff'
import { ImageContainer } from './image-container'

interface ISwipeState {
  readonly percentage: number
}

export class Swipe extends React.Component<
  ICommonImageDiffProperties,
  ISwipeState
> {
  public constructor(props: ICommonImageDiffProperties) {
    super(props)

    this.state = { percentage: 0 }
  }

  public render() {

    // Figure out if maxSize height or width is bigger
    const relevantSize =
      this.props.maxSize.height > this.props.maxSize.width
        ? this.props.maxSize.height
        : this.props.maxSize.width;

    const originalWidth = this.props.maxSize.width
    // Find biggest power of 2 that the relevant size can be multiplied width without exceeding 320
    const maxPowerOf2 = Math.floor( Math.log2(320 / relevantSize) );
    const finalHeight = this.props.maxSize.height * Math.pow(2, maxPowerOf2);
    const finalWidth = this.props.maxSize.width * Math.pow(2, maxPowerOf2);

    const style: React.CSSProperties = {
      height: `${finalHeight}px`,
      width: `${finalWidth}px`,
    }

    const swiperWidth =
      finalWidth * (1 - this.state.percentage / 100.0)

    const previousStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: `${this.props.maxSize.height * Math.pow(2, maxPowerOf2)}px`,
      width: `${this.props.maxSize.width * Math.pow(2, maxPowerOf2)}px`,
      clipPath: `inset(0 ${Math.floor(swiperWidth)}px 0 0)`,
    }

    const currentStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: `${this.props.maxSize.height * Math.pow(2, maxPowerOf2)}px`,
      width: `${this.props.maxSize.width * Math.pow(2, maxPowerOf2)}px`,
      clipPath: `inset(0 0 0 ${Math.floor(
        finalWidth - swiperWidth
      )}px)`,
    }

    const maxSize: React.CSSProperties = {
      maxHeight: `${finalHeight}px`,
      maxWidth: `${finalWidth}px`,
      height: '100%',
      width: '100%',
    }

    return (
      <div className="image-diff-swipe">
        <input
          style={{
            width: `${finalWidth + Math.pow(2, maxPowerOf2)*2}px`,
            background: `linear-gradient(to right, var(--color-deleted) ${this.state.percentage}%, var(--color-new) ${this.state.percentage}%)`,
          }}
          className="slider"
          type="range"
          max={100}
          min={0}
          value={this.state.percentage}
          step={100 / originalWidth}
          onChange={this.onValueChange}
        />
        <div className="sizing-container" ref={this.props.onContainerRef}>
          <div className="image-container image-container-border" style={{
            width: `${finalWidth + 2}px`,
            height: `${finalHeight + 2}px`,
            background: `linear-gradient(to right, var(--color-deleted) ${this.state.percentage}%, var(--color-new) ${this.state.percentage}%)`,
          }}></div>
          <div className="image-container" style={style}>
            <div className="image-diff-previous" style={previousStyle}>
              <ImageContainer
                image={this.props.previous}
                onElementLoad={this.props.onPreviousImageLoad}
                style={maxSize}
              />
            </div>
            <div className="image-diff-current" style={currentStyle}>
              <ImageContainer
                image={this.props.current}
                onElementLoad={this.props.onCurrentImageLoad}
                style={maxSize}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  private onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = e.currentTarget.valueAsNumber
    this.setState({ percentage })
  }
}
