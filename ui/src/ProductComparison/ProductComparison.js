import React, {useState, useEffect} from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import Slider from 'react-slick';

// Mock data for products
const productsData = [
    {
      id: 1,
      name: "Product 1",
      images: [
        'https://photos.zillowstatic.com/fp/9b07794c02cdbbcbb2167383ac072973-p_d.jpg',
        'https://photos.zillowstatic.com/fp/e8ce6326b26d42675c3f078c1dac8d93-p_d.jpg'
      ],
      metadata: {
        Price: "$49.99",
        Manufacturer: "Manufacturer A",
        Warranty: "2 years"
      }
    },
    {
      id: 2,
      name: "Product 2",
      images: [
        'https://photos.zillowstatic.com/fp/0db3e6ee8baeef0d790002e74b6740f5-p_d.jpg',
        'https://photos.zillowstatic.com/fp/19c1a41adc8176418b027c5deba975df-p_d.jpg'
      ],
      metadata: {
        Price: "$59.99",
        Manufacturer: "Manufacturer B",
        Warranty: "3 years"
      }
    }
  ];
  

const ProductComparison = () => {

  const [products, setProducts] = useState(productsData);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://example.com/api/products');
      const data = await response.json();
      setProducts(data);
      console.log('data fetched')
    } catch (error) {
      console.error('Failed to fetch products now:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  return (
    <Grid container spacing={2}>
      {products.map(product => (
        <Grid item xs={12} md={6} key={product.id} style={{padding: '40px'}}>
          <Paper elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Slider {...settings}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Slide ${index}`} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                </div>
              ))}
            </Slider>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {Object.entries(product.metadata).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={key} secondary={value} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Button variant="contained" fullWidth sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}>
            I like this
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductComparison;
