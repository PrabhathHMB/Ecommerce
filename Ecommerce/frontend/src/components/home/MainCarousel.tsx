
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';

const mainCarouselData = [

    {
        image: "https://outfit.lk/cdn/shop/files/Home_Hero_Banner_Desktop_1.webp?v=1766461335&width=2000",
        path: "/products?category=Women"
    },

    {
        image: "https://cms.sriyanidresspoint.lk/storage/home/slider/cover%20page%20%20copy.jpg",
        path: "/products?category=women"
    },
    {
        image: "https://coolplanet.lk/cdn/shop/files/Season_25_-_Website_Banner_-_Desktop.webp?v=1766402564&width=3840",
        path: "/products?category=women"
    },
    {
        image: "https://slay.lk/cdn/shop/files/70_4832b7e1-65da-4729-8d6f-e23fcb794069.png?v=1765452528&width=1880",
        path: "/products?category=women"
    },


];

const MainCarousel = () => {
    const items = mainCarouselData.map((item) => (
        <div className='item' key={item.image}>
            <Link to={item.path}>
                <img
                    className='cursor-pointer'
                    role='presentation'
                    src={item.image}
                    alt="Fashion Banner"
                    style={{
                        width: '100%',
                        height: '700px',
                        objectFit: 'cover',
                        objectPosition: 'top'
                    }}
                />
            </Link>
        </div>
    ));

    return (
        <div className="main-carousel-container" style={{ width: '100%', position: 'relative' }}>
            <AliceCarousel
                items={items}
                disableButtonsControls
                autoPlay
                autoPlayInterval={3000}
                infinite
                mouseTracking
            />
        </div>
    );
}

export default MainCarousel;
