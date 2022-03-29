import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './index.less';

interface ScrollTableType {
  data: any[];
  slidesToShow: number;
  scrollPause: boolean;
}

let scrollRef: Slider | null;

const ScrollTable: React.FC<ScrollTableType> = (props) => {
  const { data, slidesToShow, scrollPause } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: scrollPause ? 10 : 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,
  };

  return (
    <div className={styles.scrollTable}>
      <div className={styles.thead}>
        <div className={styles.name}>设备</div>
        <div className={styles.address}>所在机房</div>
        <div className={styles.content}>内容</div>
        <div className={styles.dateTime}>时间</div>
        <div className={styles.state}>事件级别</div>
      </div>
      <Slider ref={(c) => (scrollRef = c)} {...settings}>
        {data.map((d) => (
          <div key={d.id} className={styles.dataRow}>
            <div className={styles.name}>{d.name}</div>
            <div className={styles.address}>{d.address}</div>
            <div className={styles.content}>{d.content}</div>
            <div className={styles.dateTime}>{d.dateTime}</div>
            <div className={styles.state}>{d.state}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ScrollTable;
export { scrollRef };
