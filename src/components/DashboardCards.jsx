// DashboardCards.jsx
import React, { useState, useEffect } from 'react';
import './styles/DashboardCards.css';

const cardData = [
  {
    title: "Total EV Sales",
    value: "3,593,811",
    trend: "↑ 48%",
    isPositive: true
  },
  {
    title: "Highest EV Adoption",
    value: "Uttar Pradesh (20.4%)",
    trend: "↑ 70%",
    isPositive: true
  },
  {
    title: "Highest Monthly EV Sale",
    value: "158,131 (May 2023)",
    trend: "↑ 3.6%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2014",
    "value": 252,
    "trend": "Nil",
    isPositive: false
  },
  {
    "title": "Highest Monthly EV Sales in 2015",
    "value": 2184,
    "trend": "↑ "+((2184 - 252) / 252 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2016",
    "value": 6336,
    "trend": "↑ "+((6336 - 2184) / 2184 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2017",
    "value": 10087,
    "trend": "↑ "+((10087 - 6336) / 6336 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2018",
    "value": 15879,
    "trend": "↑ "+((15879 - 10087) / 10087 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2019",
    "value": 19006,
    "trend": "↑ "+((19006 - 15879) / 15879 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2020",
    "value": 16865,
    "trend": " "+((- 16865 + 19006) / 19006 * 100).toFixed(2) + "%",
    isPositive: false
  },
  {
    "title": "Highest Monthly EV Sales in 2021",
    "value": 53749,
    "trend": "↑ "+((53749 - 16865) / 16865 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2022",
    "value": 121570,
    "trend": "↑ "+((121570 - 53749) / 53749 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2023",
    "value": 158131,
    "trend": "↑ "+((158131 - 121570) / 121570 * 100).toFixed(2) + "%",
    isPositive: true
  },
  {
    "title": "Highest Monthly EV Sales in 2024",
    "value": 143182,
    "trend": " "+((- 143182 + 158131) / 158131 * 100).toFixed(2) + "%",
    isPositive: false
  }, {
    "title": "Highest Electric penetration state",
    "value": "Delhi (4.33%)",
    "trend": "↑ 13.5%",
    isPositive: true
  }
];

const DashboardCards = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getDisplayCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % cardData.length;
      cards.push(cardData[index]);
    }
    return cards;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setStartIndex(prevIndex => (prevIndex + 3) % cardData.length);
        setIsTransitioning(false);
      }, 600);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value) => {
    return typeof value === 'number' ? 
      value.toLocaleString() : 
      value;
  };

  return (
    <div className="dashboard-cards">
      {getDisplayCards().map((card, index) => (
        <div 
          key={`${startIndex}-${index}`}
          className={`dashboard-card ${isTransitioning ? 'transitioning' : ''}`}
        >
          <div className="dashboard-card-title">{card.title}</div>
          <div className="dashboard-card-value">
            {formatValue(card.value)}
          </div>
          <div className={`dashboard-card-trend ${card.isPositive ? 'positive' : 'negative'}`}>
            {card.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;