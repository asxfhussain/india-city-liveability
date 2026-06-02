"use client";

import { useParams, useRouter } from "next/navigation";
import { CITIES, WEIGHTS } from "../../data/cities";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

function scoreLabel(key, val) {
  if (key === "cost") return val >= 75 ? "Very Affordable" : val >= 60 ? "Affordable" : val >= 45 ? "Moderate" : "Expensive";
  if (key === "air") return val >= 80 ? "Clean" : val >= 60 ? "Moderate" : val >= 40 ? "Polluted" : "Very Polluted";
  if (key === "jobs") return val >= 85 ? "Excellent" : val >= 70 ? "Good" : val >= 55 ? "Moderate" : "Limited";
  if (key === "weather") return val >= 80 ? "Pleasant" : val >= 60 ? "Moderate" : val >= 40 ? "Harsh" : "Very Harsh";
  if (key === "internet") return val >= 80 ? "Fast" : val >= 65 ? "Good" : val >= 50 ? "Average" : "Slow";
  if (key === "traffic") return val >= 75 ? "Smooth" : val >= 55 ? "Moderate" : val >= 35 ? "Congested" : "Gridlock";
  if (key === "safety") return val >= 80 ? "Very Safe" : val >= 65 ? "Safe" : val >= 50 ? "Moderate" : "Caution";
  if (key === "food") return val >= 88 ? "World Class" : val >= 78 ? "Excellent" : val >= 68 ? "Good" : "Limited";
}

const CITY_DETAILS = {
  ban: { avgRent: "₹18,000 – ₹35,000", topCompanies: ["Infosys", "Wipro", "Flipkart", "Google", "Amazon"], neighbourhoods: [{ name: "Koramangala", rent1bhk: 28000, rent2bhk: 45000, vibe: "Startup hub, cafes, nightlife" }, { name: "Indiranagar", rent1bhk: 32000, rent2bhk: 52000, vibe: "Trendy, restaurants, metro access" }, { name: "Whitefield", rent1bhk: 18000, rent2bhk: 30000, vibe: "IT corridor, family-friendly" }, { name: "HSR Layout", rent1bhk: 22000, rent2bhk: 38000, vibe: "Balanced, good infrastructure" }, { name: "Marathahalli", rent1bhk: 16000, rent2bhk: 26000, vibe: "Affordable, near IT parks" }, { name: "Electronic City", rent1bhk: 14000, rent2bhk: 22000, vibe: "Budget IT hub, Infosys campus" }, { name: "Sarjapur Road", rent1bhk: 20000, rent2bhk: 34000, vibe: "Growing, tech companies, malls" }, { name: "JP Nagar", rent1bhk: 18000, rent2bhk: 30000, vibe: "Residential, good schools, calm" }, { name: "Yelahanka", rent1bhk: 12000, rent2bhk: 20000, vibe: "Airport proximity, affordable" }, { name: "Bannerghatta Road", rent1bhk: 15000, rent2bhk: 25000, vibe: "Nature nearby, mid-range" }], funFact: "Bengaluru has the highest number of tech startups in India." },
  hyd: { avgRent: "₹12,000 – ₹25,000", topCompanies: ["Microsoft", "Google", "Amazon", "TCS", "Cyberabad firms"], neighbourhoods: [{ name: "Gachibowli", rent1bhk: 18000, rent2bhk: 30000, vibe: "IT hub, modern, well-connected" }, { name: "Banjara Hills", rent1bhk: 25000, rent2bhk: 42000, vibe: "Premium, upscale, restaurants" }, { name: "Madhapur", rent1bhk: 16000, rent2bhk: 26000, vibe: "HITEC City proximity, lively" }, { name: "Kondapur", rent1bhk: 14000, rent2bhk: 22000, vibe: "Affordable, growing fast" }, { name: "Jubilee Hills", rent1bhk: 22000, rent2bhk: 38000, vibe: "Posh, quiet, great food" }, { name: "Kukatpally", rent1bhk: 12000, rent2bhk: 20000, vibe: "Budget-friendly, well-connected" }, { name: "Miyapur", rent1bhk: 10000, rent2bhk: 17000, vibe: "Affordable, metro access" }, { name: "Begumpet", rent1bhk: 20000, rent2bhk: 34000, vibe: "Central, airport nearby, upscale" }, { name: "LB Nagar", rent1bhk: 9000, rent2bhk: 15000, vibe: "Most affordable, old city feel" }, { name: "Nanakramguda", rent1bhk: 16000, rent2bhk: 28000, vibe: "Financial district, new builds" }], funFact: "Hyderabad's biryani is so legendary that the city ships over 50,000 kg of it daily — it's the only Indian city where biryani has its own dedicated logistics network." },
  mum: { avgRent: "₹25,000 – ₹60,000", topCompanies: ["Reliance", "HDFC", "Tata", "Bollywood Studios", "ICICI"], neighbourhoods: [{ name: "Bandra", rent1bhk: 55000, rent2bhk: 90000, vibe: "Bollywood, nightlife, sea view" }, { name: "Andheri", rent1bhk: 35000, rent2bhk: 58000, vibe: "Commercial hub, well-connected" }, { name: "Powai", rent1bhk: 32000, rent2bhk: 52000, vibe: "IT, lake view, family-friendly" }, { name: "Lower Parel", rent1bhk: 45000, rent2bhk: 75000, vibe: "Finance district, upscale malls" }, { name: "Thane", rent1bhk: 18000, rent2bhk: 30000, vibe: "Affordable Mumbai suburb" }, { name: "Malad", rent1bhk: 28000, rent2bhk: 46000, vibe: "Suburban, malls, decent connectivity" }, { name: "Goregaon", rent1bhk: 30000, rent2bhk: 50000, vibe: "Film studios, growing area" }, { name: "Chembur", rent1bhk: 25000, rent2bhk: 42000, vibe: "Central suburb, improving metro" }, { name: "Navi Mumbai", rent1bhk: 15000, rent2bhk: 25000, vibe: "Planned city, most affordable option" }, { name: "Borivali", rent1bhk: 26000, rent2bhk: 44000, vibe: "Green, national park nearby" }], funFact: "Mumbai's local train network carries 7.5 million passengers daily." },
  del: { avgRent: "₹15,000 – ₹35,000", topCompanies: ["Govt of India", "HCL", "Hero MotoCorp", "Zomato", "Paytm"], neighbourhoods: [{ name: "Connaught Place", rent1bhk: 35000, rent2bhk: 58000, vibe: "Central, premium, business hub" }, { name: "Hauz Khas", rent1bhk: 28000, rent2bhk: 46000, vibe: "Trendy, cafes, nightlife" }, { name: "Dwarka", rent1bhk: 14000, rent2bhk: 22000, vibe: "Affordable, metro connected" }, { name: "Noida Sec 62", rent1bhk: 12000, rent2bhk: 20000, vibe: "IT hub, budget-friendly" }, { name: "Gurgaon", rent1bhk: 22000, rent2bhk: 38000, vibe: "Corporate, malls, expat-friendly" }, { name: "Lajpat Nagar", rent1bhk: 20000, rent2bhk: 34000, vibe: "Central, market, good food" }, { name: "Rohini", rent1bhk: 12000, rent2bhk: 20000, vibe: "Large township, affordable" }, { name: "Saket", rent1bhk: 25000, rent2bhk: 42000, vibe: "Upscale, malls, metro" }, { name: "Vasant Kunj", rent1bhk: 22000, rent2bhk: 38000, vibe: "Green, embassies, premium" }, { name: "Greater Noida", rent1bhk: 9000, rent2bhk: 15000, vibe: "Most affordable NCR, expressway" }], funFact: "Delhi has more trees than any other Indian city — over 7 million." },
  pun: { avgRent: "₹10,000 – ₹22,000", topCompanies: ["Infosys", "Wipro", "Bajaj Auto", "Forbes Marshall", "KPIT"], neighbourhoods: [{ name: "Koregaon Park", rent1bhk: 22000, rent2bhk: 38000, vibe: "Upscale, expats, breweries" }, { name: "Baner", rent1bhk: 16000, rent2bhk: 26000, vibe: "IT hub, modern apartments" }, { name: "Hinjewadi", rent1bhk: 12000, rent2bhk: 20000, vibe: "IT park area, affordable" }, { name: "Viman Nagar", rent1bhk: 18000, rent2bhk: 30000, vibe: "Near airport, cosmopolitan" }, { name: "Kothrud", rent1bhk: 13000, rent2bhk: 22000, vibe: "Residential, good schools" }, { name: "Wakad", rent1bhk: 12000, rent2bhk: 20000, vibe: "Growing, near Hinjewadi" }, { name: "Kharadi", rent1bhk: 14000, rent2bhk: 24000, vibe: "IT corridor, modern" }, { name: "Hadapsar", rent1bhk: 10000, rent2bhk: 17000, vibe: "Affordable, Magarpatta proximity" }, { name: "Aundh", rent1bhk: 18000, rent2bhk: 30000, vibe: "Premium, well-developed" }, { name: "Pimpri", rent1bhk: 9000, rent2bhk: 15000, vibe: "Industrial, budget, PCMC area" }], funFact: "Pune has the highest number of engineering colleges in India." },
  che: { avgRent: "₹12,000 – ₹28,000", topCompanies: ["Ford", "Hyundai", "TCS", "Cognizant", "Zoho"], neighbourhoods: [{ name: "Anna Nagar", rent1bhk: 18000, rent2bhk: 30000, vibe: "Premium residential, wide roads" }, { name: "Velachery", rent1bhk: 14000, rent2bhk: 24000, vibe: "IT corridor, metro connected" }, { name: "OMR", rent1bhk: 12000, rent2bhk: 20000, vibe: "IT highway, budget options" }, { name: "Adyar", rent1bhk: 20000, rent2bhk: 34000, vibe: "Upscale, near beach" }, { name: "Porur", rent1bhk: 10000, rent2bhk: 17000, vibe: "Affordable, growing area" }, { name: "Sholinganallur", rent1bhk: 13000, rent2bhk: 22000, vibe: "IT hub, near OMR" }, { name: "Tambaram", rent1bhk: 8000, rent2bhk: 14000, vibe: "Most affordable, southern suburb" }, { name: "T Nagar", rent1bhk: 22000, rent2bhk: 38000, vibe: "Shopping capital, central" }, { name: "Perambur", rent1bhk: 9000, rent2bhk: 15000, vibe: "Budget, north Chennai" }, { name: "Mylapore", rent1bhk: 18000, rent2bhk: 30000, vibe: "Heritage, temples, culture" }], funFact: "Chennai is India's automobile capital — produces 35% of vehicles." },
  kol: { avgRent: "₹8,000 – ₹18,000", topCompanies: ["ITC", "Coal India", "Wipro", "TCS", "Bandhan Bank"], neighbourhoods: [{ name: "Salt Lake", rent1bhk: 14000, rent2bhk: 24000, vibe: "IT sector, planned township" }, { name: "New Town", rent1bhk: 12000, rent2bhk: 20000, vibe: "Modern, metro connected" }, { name: "Park Street", rent1bhk: 20000, rent2bhk: 34000, vibe: "Central, restaurants, nightlife" }, { name: "Ballygunge", rent1bhk: 16000, rent2bhk: 28000, vibe: "Upscale, heritage buildings" }, { name: "Howrah", rent1bhk: 7000, rent2bhk: 12000, vibe: "Most affordable, old city" }, { name: "Rajarhat", rent1bhk: 10000, rent2bhk: 17000, vibe: "New township, IT companies" }, { name: "Tollygunge", rent1bhk: 12000, rent2bhk: 20000, vibe: "Metro access, film industry" }, { name: "Dumdum", rent1bhk: 8000, rent2bhk: 14000, vibe: "Airport proximity, affordable" }, { name: "Behala", rent1bhk: 9000, rent2bhk: 15000, vibe: "South Kolkata, residential" }, { name: "Gariahat", rent1bhk: 15000, rent2bhk: 25000, vibe: "Shopping, restaurants, lively" }], funFact: "Kolkata has India's only underground metro that runs beneath a river." },
  ahm: { avgRent: "₹8,000 – ₹20,000", topCompanies: ["Adani", "Torrent", "Zydus", "Amul", "ISRO SAC"], neighbourhoods: [{ name: "SG Highway", rent1bhk: 16000, rent2bhk: 26000, vibe: "Corporate hub, malls, modern" }, { name: "Prahlad Nagar", rent1bhk: 14000, rent2bhk: 24000, vibe: "Business district, upscale" }, { name: "Navrangpura", rent1bhk: 12000, rent2bhk: 20000, vibe: "Central, well-connected" }, { name: "Satellite", rent1bhk: 13000, rent2bhk: 22000, vibe: "Residential, good amenities" }, { name: "Bopal", rent1bhk: 9000, rent2bhk: 15000, vibe: "Affordable, growing suburb" }, { name: "Vastrapur", rent1bhk: 14000, rent2bhk: 24000, vibe: "Lake view, upscale, peaceful" }, { name: "Maninagar", rent1bhk: 8000, rent2bhk: 14000, vibe: "Old city, affordable, busy" }, { name: "Thaltej", rent1bhk: 12000, rent2bhk: 20000, vibe: "Near SG Highway, developing" }, { name: "Chandkheda", rent1bhk: 7000, rent2bhk: 12000, vibe: "Budget, north Ahmedabad" }, { name: "Gota", rent1bhk: 8000, rent2bhk: 14000, vibe: "Affordable, residential" }], funFact: "Ahmedabad was India's first UNESCO World Heritage City." },
  jai: { avgRent: "₹7,000 – ₹16,000", topCompanies: ["Govt sector", "Rajasthan IT", "Gem & jewellery firms", "Tourism"], neighbourhoods: [{ name: "Malviya Nagar", rent1bhk: 12000, rent2bhk: 20000, vibe: "Premium, upscale, safe" }, { name: "Vaishali Nagar", rent1bhk: 10000, rent2bhk: 17000, vibe: "Family-friendly, well-planned" }, { name: "C-Scheme", rent1bhk: 14000, rent2bhk: 24000, vibe: "Central, commercial, heritage" }, { name: "Mansarovar", rent1bhk: 8000, rent2bhk: 14000, vibe: "Affordable, large township" }, { name: "Jagatpura", rent1bhk: 7000, rent2bhk: 12000, vibe: "Budget, near IT zone" }, { name: "Tonk Road", rent1bhk: 9000, rent2bhk: 15000, vibe: "Developing, good connectivity" }, { name: "Bani Park", rent1bhk: 13000, rent2bhk: 22000, vibe: "Heritage, peaceful, premium" }, { name: "Sitapura", rent1bhk: 6000, rent2bhk: 10000, vibe: "Industrial zone, cheapest option" }, { name: "Gopalpura", rent1bhk: 8000, rent2bhk: 14000, vibe: "Residential, western Jaipur" }, { name: "Raja Park", rent1bhk: 10000, rent2bhk: 17000, vibe: "Central, vibrant, market nearby" }], funFact: "Jaipur's entire old city was painted pink in 1876 to welcome the Prince of Wales." },
  chan: { avgRent: "₹9,000 – ₹20,000", topCompanies: ["Infosys", "Quark", "DLF", "IT Park firms"], neighbourhoods: [{ name: "Sector 17", rent1bhk: 16000, rent2bhk: 28000, vibe: "Central plaza, commercial" }, { name: "Sector 35", rent1bhk: 14000, rent2bhk: 24000, vibe: "Residential, good connectivity" }, { name: "Mohali", rent1bhk: 10000, rent2bhk: 17000, vibe: "IT hub, affordable, newer" }, { name: "Panchkula", rent1bhk: 9000, rent2bhk: 15000, vibe: "Quiet, green, family-friendly" }, { name: "Sector 43", rent1bhk: 12000, rent2bhk: 20000, vibe: "Near IT park, popular" }, { name: "Sector 22", rent1bhk: 14000, rent2bhk: 24000, vibe: "Commercial, market, central" }, { name: "Zirakpur", rent1bhk: 8000, rent2bhk: 14000, vibe: "Affordable suburb, highway access" }, { name: "Sector 70", rent1bhk: 11000, rent2bhk: 18000, vibe: "Modern, Mohali extension" }, { name: "Kharar", rent1bhk: 7000, rent2bhk: 12000, vibe: "Budget, outskirts, growing" }, { name: "Sector 8", rent1bhk: 18000, rent2bhk: 30000, vibe: "Premium, near Sukhna Lake" }], funFact: "Chandigarh was designed by Swiss-French architect Le Corbusier." },
  kochi: { avgRent: "₹9,000 – ₹20,000", topCompanies: ["Infopark firms", "UST Global", "IBS Software", "BPCL"], neighbourhoods: [{ name: "Kakkanad", rent1bhk: 12000, rent2bhk: 20000, vibe: "IT hub, Infopark proximity" }, { name: "Marine Drive", rent1bhk: 18000, rent2bhk: 30000, vibe: "Waterfront, premium, scenic" }, { name: "Edapally", rent1bhk: 10000, rent2bhk: 17000, vibe: "Well-connected, metro access" }, { name: "Fort Kochi", rent1bhk: 14000, rent2bhk: 24000, vibe: "Heritage, touristy, unique" }, { name: "Thrippunithura", rent1bhk: 8000, rent2bhk: 14000, vibe: "Affordable, calm, residential" }, { name: "Aluva", rent1bhk: 7000, rent2bhk: 12000, vibe: "Budget, airport proximity" }, { name: "Vytilla", rent1bhk: 12000, rent2bhk: 20000, vibe: "Transport hub, central" }, { name: "Panampilly Nagar", rent1bhk: 16000, rent2bhk: 28000, vibe: "Upscale, restaurants, posh" }, { name: "Kalamassery", rent1bhk: 9000, rent2bhk: 15000, vibe: "Industrial, affordable, CSEZ" }, { name: "Maradu", rent1bhk: 11000, rent2bhk: 18000, vibe: "Lakeside, residential, quiet" }], funFact: "Kochi has India's first solar-powered international airport." },
  ind: { avgRent: "₹6,000 – ₹14,000", topCompanies: ["Infosys BPO", "NPCI", "Brilliant", "IT Park firms"], neighbourhoods: [{ name: "Vijay Nagar", rent1bhk: 10000, rent2bhk: 17000, vibe: "Most popular, well-developed" }, { name: "Scheme 54", rent1bhk: 12000, rent2bhk: 20000, vibe: "Premium, planned, upscale" }, { name: "AB Road", rent1bhk: 8000, rent2bhk: 14000, vibe: "Central, commercial corridor" }, { name: "Super Corridor", rent1bhk: 7000, rent2bhk: 12000, vibe: "IT zone, modern, affordable" }, { name: "Palasia", rent1bhk: 9000, rent2bhk: 15000, vibe: "Central, busy, good food" }, { name: "Bhawarkua", rent1bhk: 7000, rent2bhk: 12000, vibe: "Residential, south Indore" }, { name: "MR 10", rent1bhk: 8000, rent2bhk: 14000, vibe: "Developing, ring road area" }, { name: "Rajendra Nagar", rent1bhk: 9000, rent2bhk: 15000, vibe: "Old established area, calm" }, { name: "Nipania", rent1bhk: 8000, rent2bhk: 14000, vibe: "Growing, near Super Corridor" }, { name: "LIG Colony", rent1bhk: 6000, rent2bhk: 10000, vibe: "Most affordable, central" }], funFact: "Indore has won India's Cleanest City award 7 years in a row." },
  sur: { avgRent: "₹7,000 – ₹15,000", topCompanies: ["Diamond industry", "Textile mills", "Reliance", "ONGC"], neighbourhoods: [{ name: "Adajan", rent1bhk: 12000, rent2bhk: 20000, vibe: "Premium, riverside, popular" }, { name: "Vesu", rent1bhk: 10000, rent2bhk: 17000, vibe: "Upscale, modern, well-planned" }, { name: "Athwa", rent1bhk: 9000, rent2bhk: 15000, vibe: "Central, commercial, busy" }, { name: "Piplod", rent1bhk: 8000, rent2bhk: 14000, vibe: "Residential, quiet, affordable" }, { name: "Katargam", rent1bhk: 6000, rent2bhk: 10000, vibe: "Most affordable, textile area" }, { name: "Pal", rent1bhk: 9000, rent2bhk: 15000, vibe: "Developing, near Vesu" }, { name: "Althan", rent1bhk: 8000, rent2bhk: 14000, vibe: "Suburban, growing, affordable" }, { name: "Varachha", rent1bhk: 7000, rent2bhk: 12000, vibe: "Diamond trading area, busy" }, { name: "Dumas", rent1bhk: 10000, rent2bhk: 17000, vibe: "Beach proximity, scenic" }, { name: "Citylight", rent1bhk: 11000, rent2bhk: 18000, vibe: "Modern, upscale, popular" }], funFact: "Surat processes 90% of the world's diamonds." },
  nag: { avgRent: "₹6,000 – ₹14,000", topCompanies: ["Govt sector", "MIHAN firms", "Ballarpur Industries"], neighbourhoods: [{ name: "Dharampeth", rent1bhk: 12000, rent2bhk: 20000, vibe: "Premium, central, upscale" }, { name: "Sitabuldi", rent1bhk: 8000, rent2bhk: 14000, vibe: "Commercial centre, busy" }, { name: "MIHAN", rent1bhk: 7000, rent2bhk: 12000, vibe: "Aerospace hub, modern, growing" }, { name: "Wardha Road", rent1bhk: 9000, rent2bhk: 15000, vibe: "Developing, good connectivity" }, { name: "Hingna", rent1bhk: 6000, rent2bhk: 10000, vibe: "Industrial, most affordable" }, { name: "Manish Nagar", rent1bhk: 8000, rent2bhk: 14000, vibe: "Residential, mid-range" }, { name: "Sadar", rent1bhk: 10000, rent2bhk: 17000, vibe: "Central, market, lively" }, { name: "Pratap Nagar", rent1bhk: 7000, rent2bhk: 12000, vibe: "Budget, west Nagpur" }, { name: "Trimurti Nagar", rent1bhk: 9000, rent2bhk: 15000, vibe: "Growing, near ring road" }, { name: "Ambazari", rent1bhk: 10000, rent2bhk: 17000, vibe: "Lake nearby, peaceful" }], funFact: "Nagpur is the geographic centre of India — zero mile marker is here." },
  vij: { avgRent: "₹5,000 – ₹12,000", topCompanies: ["Govt AP", "IT SEZ firms", "Amara Raja", "Aurobindo"], neighbourhoods: [{ name: "Benz Circle", rent1bhk: 10000, rent2bhk: 17000, vibe: "Central, commercial, busy" }, { name: "MG Road", rent1bhk: 8000, rent2bhk: 14000, vibe: "Main street, shopping, food" }, { name: "Governorpet", rent1bhk: 7000, rent2bhk: 12000, vibe: "Old city, affordable, lively" }, { name: "Kanuru", rent1bhk: 6000, rent2bhk: 10000, vibe: "Residential, calm, budget" }, { name: "Auto Nagar", rent1bhk: 5000, rent2bhk: 8000, vibe: "Most affordable, industrial" }, { name: "Moghalrajpuram", rent1bhk: 7000, rent2bhk: 12000, vibe: "Residential, growing area" }, { name: "Patamata", rent1bhk: 8000, rent2bhk: 14000, vibe: "Mid-range, central suburb" }, { name: "Krishna Lanka", rent1bhk: 6000, rent2bhk: 10000, vibe: "River island, unique, budget" }, { name: "Tadepalli", rent1bhk: 7000, rent2bhk: 12000, vibe: "Across river, AP capital zone" }, { name: "Ajit Singh Nagar", rent1bhk: 9000, rent2bhk: 15000, vibe: "Upscale, gated communities" }], funFact: "Vijayawada sits on the Krishna river delta and is one of India's fastest growing cities." },
};

const SALARY_DATA = {
  ban: [
    { role: "SDE 1", min: 8, max: 15, median: 11 },
    { role: "SDE 2", min: 18, max: 35, median: 24 },
    { role: "Data Analyst", min: 6, max: 14, median: 9 },
    { role: "Data Scientist", min: 12, max: 28, median: 18 },
    { role: "Product Manager", min: 20, max: 45, median: 30 },
    { role: "DevOps Engineer", min: 10, max: 22, median: 15 },
    { role: "ML Engineer", min: 14, max: 32, median: 20 },
    { role: "UI/UX Designer", min: 6, max: 18, median: 10 },
  ],
  hyd: [
    { role: "SDE 1", min: 7, max: 14, median: 10 },
    { role: "SDE 2", min: 16, max: 30, median: 21 },
    { role: "Data Analyst", min: 5, max: 12, median: 8 },
    { role: "Data Scientist", min: 10, max: 24, median: 16 },
    { role: "Product Manager", min: 18, max: 40, median: 26 },
    { role: "DevOps Engineer", min: 9, max: 20, median: 13 },
    { role: "ML Engineer", min: 12, max: 28, median: 18 },
    { role: "UI/UX Designer", min: 5, max: 15, median: 9 },
  ],
  mum: [
    { role: "SDE 1", min: 9, max: 18, median: 13 },
    { role: "SDE 2", min: 20, max: 40, median: 28 },
    { role: "Data Analyst", min: 7, max: 16, median: 11 },
    { role: "Data Scientist", min: 14, max: 32, median: 21 },
    { role: "Product Manager", min: 25, max: 55, median: 36 },
    { role: "DevOps Engineer", min: 12, max: 25, median: 17 },
    { role: "ML Engineer", min: 16, max: 36, median: 24 },
    { role: "UI/UX Designer", min: 7, max: 20, median: 12 },
  ],
  del: [
    { role: "SDE 1", min: 8, max: 16, median: 11 },
    { role: "SDE 2", min: 18, max: 35, median: 24 },
    { role: "Data Analyst", min: 6, max: 14, median: 9 },
    { role: "Data Scientist", min: 12, max: 28, median: 18 },
    { role: "Product Manager", min: 22, max: 48, median: 32 },
    { role: "DevOps Engineer", min: 10, max: 22, median: 15 },
    { role: "ML Engineer", min: 14, max: 30, median: 20 },
    { role: "UI/UX Designer", min: 6, max: 18, median: 10 },
  ],
  pun: [
    { role: "SDE 1", min: 7, max: 13, median: 9 },
    { role: "SDE 2", min: 15, max: 28, median: 20 },
    { role: "Data Analyst", min: 5, max: 11, median: 7 },
    { role: "Data Scientist", min: 9, max: 22, median: 14 },
    { role: "Product Manager", min: 16, max: 36, median: 24 },
    { role: "DevOps Engineer", min: 8, max: 18, median: 12 },
    { role: "ML Engineer", min: 11, max: 24, median: 16 },
    { role: "UI/UX Designer", min: 5, max: 14, median: 8 },
  ],
  che: [
    { role: "SDE 1", min: 6, max: 13, median: 9 },
    { role: "SDE 2", min: 14, max: 28, median: 19 },
    { role: "Data Analyst", min: 5, max: 11, median: 7 },
    { role: "Data Scientist", min: 9, max: 22, median: 14 },
    { role: "Product Manager", min: 15, max: 34, median: 22 },
    { role: "DevOps Engineer", min: 8, max: 18, median: 12 },
    { role: "ML Engineer", min: 10, max: 24, median: 15 },
    { role: "UI/UX Designer", min: 5, max: 14, median: 8 },
  ],
  kol: [
    { role: "SDE 1", min: 5, max: 10, median: 7 },
    { role: "SDE 2", min: 10, max: 20, median: 14 },
    { role: "Data Analyst", min: 4, max: 9, median: 6 },
    { role: "Data Scientist", min: 7, max: 16, median: 11 },
    { role: "Product Manager", min: 12, max: 26, median: 17 },
    { role: "DevOps Engineer", min: 6, max: 14, median: 9 },
    { role: "ML Engineer", min: 8, max: 18, median: 12 },
    { role: "UI/UX Designer", min: 4, max: 10, median: 6 },
  ],
  ahm: [
    { role: "SDE 1", min: 5, max: 11, median: 8 },
    { role: "SDE 2", min: 12, max: 22, median: 16 },
    { role: "Data Analyst", min: 4, max: 10, median: 6 },
    { role: "Data Scientist", min: 8, max: 18, median: 12 },
    { role: "Product Manager", min: 14, max: 28, median: 19 },
    { role: "DevOps Engineer", min: 7, max: 15, median: 10 },
    { role: "ML Engineer", min: 9, max: 20, median: 13 },
    { role: "UI/UX Designer", min: 4, max: 11, median: 7 },
  ],
  jai: [
    { role: "SDE 1", min: 4, max: 9, median: 6 },
    { role: "SDE 2", min: 8, max: 16, median: 11 },
    { role: "Data Analyst", min: 3, max: 8, median: 5 },
    { role: "Data Scientist", min: 6, max: 14, median: 9 },
    { role: "Product Manager", min: 10, max: 22, median: 14 },
    { role: "DevOps Engineer", min: 5, max: 12, median: 8 },
    { role: "ML Engineer", min: 7, max: 16, median: 10 },
    { role: "UI/UX Designer", min: 3, max: 9, median: 5 },
  ],
  chan: [
    { role: "SDE 1", min: 5, max: 10, median: 7 },
    { role: "SDE 2", min: 10, max: 20, median: 14 },
    { role: "Data Analyst", min: 4, max: 9, median: 6 },
    { role: "Data Scientist", min: 7, max: 16, median: 11 },
    { role: "Product Manager", min: 12, max: 24, median: 16 },
    { role: "DevOps Engineer", min: 6, max: 13, median: 9 },
    { role: "ML Engineer", min: 8, max: 18, median: 12 },
    { role: "UI/UX Designer", min: 4, max: 10, median: 6 },
  ],
  kochi: [
    { role: "SDE 1", min: 5, max: 10, median: 7 },
    { role: "SDE 2", min: 10, max: 20, median: 14 },
    { role: "Data Analyst", min: 4, max: 9, median: 6 },
    { role: "Data Scientist", min: 7, max: 16, median: 11 },
    { role: "Product Manager", min: 11, max: 24, median: 16 },
    { role: "DevOps Engineer", min: 6, max: 13, median: 9 },
    { role: "ML Engineer", min: 8, max: 18, median: 12 },
    { role: "UI/UX Designer", min: 4, max: 10, median: 6 },
  ],
  ind: [
    { role: "SDE 1", min: 4, max: 8, median: 6 },
    { role: "SDE 2", min: 8, max: 15, median: 11 },
    { role: "Data Analyst", min: 3, max: 7, median: 5 },
    { role: "Data Scientist", min: 6, max: 13, median: 9 },
    { role: "Product Manager", min: 9, max: 20, median: 13 },
    { role: "DevOps Engineer", min: 5, max: 11, median: 7 },
    { role: "ML Engineer", min: 7, max: 15, median: 10 },
    { role: "UI/UX Designer", min: 3, max: 8, median: 5 },
  ],
  sur: [
    { role: "SDE 1", min: 4, max: 9, median: 6 },
    { role: "SDE 2", min: 9, max: 17, median: 12 },
    { role: "Data Analyst", min: 3, max: 8, median: 5 },
    { role: "Data Scientist", min: 6, max: 14, median: 9 },
    { role: "Product Manager", min: 10, max: 22, median: 14 },
    { role: "DevOps Engineer", min: 5, max: 12, median: 8 },
    { role: "ML Engineer", min: 7, max: 16, median: 10 },
    { role: "UI/UX Designer", min: 3, max: 9, median: 5 },
  ],
  nag: [
    { role: "SDE 1", min: 3, max: 8, median: 5 },
    { role: "SDE 2", min: 7, max: 14, median: 10 },
    { role: "Data Analyst", min: 3, max: 7, median: 4 },
    { role: "Data Scientist", min: 5, max: 12, median: 8 },
    { role: "Product Manager", min: 8, max: 18, median: 12 },
    { role: "DevOps Engineer", min: 4, max: 10, median: 7 },
    { role: "ML Engineer", min: 6, max: 13, median: 9 },
    { role: "UI/UX Designer", min: 3, max: 7, median: 4 },
  ],
  vij: [
    { role: "SDE 1", min: 3, max: 7, median: 5 },
    { role: "SDE 2", min: 6, max: 13, median: 9 },
    { role: "Data Analyst", min: 2, max: 6, median: 4 },
    { role: "Data Scientist", min: 4, max: 11, median: 7 },
    { role: "Product Manager", min: 7, max: 16, median: 11 },
    { role: "DevOps Engineer", min: 4, max: 9, median: 6 },
    { role: "ML Engineer", min: 5, max: 12, median: 8 },
    { role: "UI/UX Designer", min: 2, max: 7, median: 4 },
  ],
};

const COMMUTE_DATA = {
  ban: { avgMinutes: 52, peakMinutes: 78, score: 20, itHubs: ["Whitefield", "Electronic City", "Koramangala"], tip: "Avoid ORR between 8-10am and 5-8pm. Metro is your best friend in central areas." },
  hyd: { avgMinutes: 32, peakMinutes: 48, score: 55, itHubs: ["Gachibowli", "Madhapur", "HITEC City"], tip: "Roads are wider than Bangalore. Living in Kondapur or Madhapur cuts commute drastically." },
  mum: { avgMinutes: 48, peakMinutes: 65, score: 30, itHubs: ["Powai", "Andheri", "BKC"], tip: "Local train is the lifeline — get a monthly pass. Avoid Western Express Highway at peak hours." },
  del: { avgMinutes: 38, peakMinutes: 58, score: 40, itHubs: ["Noida Sec 62", "Gurgaon Cyber City", "Connaught Place"], tip: "Metro coverage is excellent. Living on the same metro line as your office is a game changer." },
  pun: { avgMinutes: 28, peakMinutes: 42, score: 60, itHubs: ["Hinjewadi", "Kharadi", "Magarpatta"], tip: "Hinjewadi traffic is notorious in the morning. Living in Baner or Wakad saves 20+ mins daily." },
  che: { avgMinutes: 35, peakMinutes: 52, score: 45, itHubs: ["OMR", "Sholinganallur", "Taramani"], tip: "OMR is the IT backbone. Living anywhere on OMR keeps commute manageable. Avoid Mount Road peak hours." },
  kol: { avgMinutes: 30, peakMinutes: 45, score: 55, itHubs: ["Salt Lake Sector V", "New Town", "Rajarhat"], tip: "Metro and trams make central Kolkata very commutable. Salt Lake Sector V is walkable from many areas." },
  ahm: { avgMinutes: 25, peakMinutes: 38, score: 65, itHubs: ["SG Highway", "Prahlad Nagar", "Thaltej"], tip: "BRTS buses are surprisingly efficient on major corridors. SG Highway is smooth except 9-10am." },
  jai: { avgMinutes: 22, peakMinutes: 32, score: 72, itHubs: ["Sitapura", "Malviya Nagar", "Tonk Road"], tip: "Jaipur traffic is light compared to metros. Most IT offices are in Sitapura — just one road." },
  chan: { avgMinutes: 18, peakMinutes: 26, score: 82, itHubs: ["IT Park Mohali", "Sector 22", "Panchkula"], tip: "Chandigarh's grid road system makes navigation effortless. Shortest average commute of any city here." },
  kochi: { avgMinutes: 30, peakMinutes: 46, score: 55, itHubs: ["Kakkanad", "Infopark", "SmartCity"], tip: "Metro connects key areas but Infopark is the main hub. Living in Kakkanad or Edapally is ideal." },
  ind: { avgMinutes: 20, peakMinutes: 30, score: 75, itHubs: ["Super Corridor", "Vijay Nagar", "AB Road"], tip: "Super Corridor is Indore's IT future. Compact city means almost nowhere is more than 30 mins away." },
  sur: { avgMinutes: 22, peakMinutes: 34, score: 68, itHubs: ["Sachin", "Hazira", "Udhna"], tip: "Surat's roads are well-maintained. Diamond and textile industries are spread out — location matters." },
  nag: { avgMinutes: 20, peakMinutes: 28, score: 76, itHubs: ["MIHAN", "Hingna", "Wardha Road"], tip: "MIHAN SEZ is the main hub — living on Wardha Road is ideal. Very few traffic jams city-wide." },
  vij: { avgMinutes: 18, peakMinutes: 25, score: 80, itHubs: ["Auto Nagar", "Kanuru SEZ", "Tadepalli"], tip: "Small city with fast commutes. The IT SEZ in Kanuru is easily accessible from most areas." },
};

const HEALTHCARE_DATA = {
  ban: { score: 82, hospitals: 48, topHospitals: ["Manipal Hospital", "Fortis", "Apollo", "Narayana Health"], medicalColleges: 14, avgConsultFee: 600, ambulanceResponse: 12, tip: "Best private healthcare in South India. Narayana Health offers world-class cardiac care at affordable prices." },
  hyd: { score: 85, hospitals: 52, topHospitals: ["AIIMS Hyderabad", "Apollo", "Yashoda", "Care Hospital"], medicalColleges: 18, avgConsultFee: 500, ambulanceResponse: 10, tip: "One of India's best healthcare cities. AIIMS Hyderabad and Apollo make it a medical tourism destination." },
  mum: { score: 88, hospitals: 98, topHospitals: ["Lilavati", "Kokilaben", "Tata Memorial", "Breach Candy"], medicalColleges: 22, avgConsultFee: 800, ambulanceResponse: 10, tip: "Best cancer care in India at Tata Memorial. Most expensive consultations but world-class specialists." },
  del: { score: 86, hospitals: 112, topHospitals: ["AIIMS Delhi", "Max", "Medanta", "Fortis Gurugram"], medicalColleges: 28, avgConsultFee: 700, ambulanceResponse: 11, tip: "AIIMS Delhi is among Asia's best public hospitals. Private sector in Gurgaon is excellent but pricey." },
  pun: { score: 78, hospitals: 38, topHospitals: ["Ruby Hall Clinic", "KEM Hospital", "Jehangir Hospital", "Sahyadri"], medicalColleges: 10, avgConsultFee: 500, ambulanceResponse: 14, tip: "Good private hospitals concentrated in central Pune. Ruby Hall and Jehangir are the gold standard here." },
  che: { score: 84, hospitals: 62, topHospitals: ["Apollo", "CMC Vellore", "MIOT", "Fortis Malar"], medicalColleges: 20, avgConsultFee: 600, ambulanceResponse: 12, tip: "CMC Vellore (nearby) is world-renowned. Chennai has excellent cardiac and orthopaedic specialists." },
  kol: { score: 76, hospitals: 58, topHospitals: ["AMRI", "Medica", "Apollo Gleneagles", "SSKM"], medicalColleges: 16, avgConsultFee: 400, ambulanceResponse: 15, tip: "Most affordable healthcare of any metro. Apollo Gleneagles is the premium choice for serious conditions." },
  ahm: { score: 79, hospitals: 44, topHospitals: ["Apollo", "Sterling", "CIMS", "SAL Hospital"], medicalColleges: 12, avgConsultFee: 450, ambulanceResponse: 13, tip: "CIMS and SAL are excellent. Gujarat's healthcare infrastructure has improved significantly in recent years." },
  jai: { score: 72, hospitals: 32, topHospitals: ["Fortis", "Eternal", "SMS Hospital", "Narayana"], medicalColleges: 8, avgConsultFee: 400, ambulanceResponse: 16, tip: "SMS is a large govt hospital but queues are long. Fortis and Eternal are reliable private options." },
  chan: { score: 80, hospitals: 28, topHospitals: ["PGI Chandigarh", "Fortis Mohali", "Max", "Ivy Hospital"], medicalColleges: 6, avgConsultFee: 500, ambulanceResponse: 11, tip: "PGI Chandigarh is a premier government hospital — one of the best in North India for serious cases." },
  kochi: { score: 83, hospitals: 36, topHospitals: ["Amrita Institute", "KIMS", "Lakeshore", "Aster Medcity"], medicalColleges: 10, avgConsultFee: 500, ambulanceResponse: 12, tip: "Amrita Institute is world-class. Kerala's healthcare literacy is the highest in India — great outcomes." },
  ind: { score: 74, hospitals: 26, topHospitals: ["Bombay Hospital", "CHL Apollo", "Medanta", "CARE CHL"], medicalColleges: 6, avgConsultFee: 400, ambulanceResponse: 14, tip: "Improving rapidly. CHL Apollo and Medanta have raised the bar significantly in recent years." },
  sur: { score: 71, hospitals: 28, topHospitals: ["Kiran Hospital", "SMIMER", "Nirali Memorial", "HCG"], medicalColleges: 5, avgConsultFee: 350, ambulanceResponse: 15, tip: "Adequate for routine care. Serious conditions may require travel to Ahmedabad or Mumbai." },
  nag: { score: 73, hospitals: 30, topHospitals: ["Orange City Hospital", "Alexis", "AIIMS Nagpur", "Wockhardt"], medicalColleges: 7, avgConsultFee: 380, ambulanceResponse: 14, tip: "AIIMS Nagpur is a game changer for central India. Good for serious cases without going to Mumbai." },
  vij: { score: 68, hospitals: 22, topHospitals: ["Andhra Hospitals", "Ramesh Hospitals", "Apollo", "NRI Hospital"], medicalColleges: 4, avgConsultFee: 300, ambulanceResponse: 16, tip: "Basic healthcare is adequate. For complex procedures, Hyderabad (3hrs away) is the practical choice." },
};

export default function CityPage() {
  const { id } = useParams();
  const router = useRouter();
  const city = CITIES.find((c) => c.id === id);
  const details = CITY_DETAILS[id];
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveAqi, setLiveAqi] = useState(null);

  useEffect(() => {
    fetch("/api/weather").then((r) => r.json()).then((d) => setLiveWeather(d[id]));
    fetch("/api/aqi").then((r) => r.json()).then((d) => setLiveAqi(d[id]));
  }, [id]);

  if (!city) return <div style={{ color: "#fff", padding: 40 }}>City not found</div>;

  const radarData = WEIGHTS.map((w) => ({
    metric: w.label,
    score: w.key === "weather" && liveWeather ? liveWeather.score
      : w.key === "air" && liveAqi ? liveAqi.score
      : city.metrics[w.key],
  }));

  const overallScore = Math.round(
    WEIGHTS.reduce((a, w) => {
      const val = w.key === "weather" && liveWeather ? liveWeather.score
        : w.key === "air" && liveAqi ? liveAqi.score
        : city.metrics[w.key];
      return a + val;
    }, 0) / WEIGHTS.length
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #0d1b3e, #0a0f2e)", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Back button */}
        <motion.button onClick={() => router.push("/")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ x: -4 }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to comparator
        </motion.button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(232,160,32,0.05))", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 24, padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: 0 }}>{city.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", margin: "4px 0 12px", fontSize: 14 }}>{city.state}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 500, lineHeight: 1.7 }}>{city.note}</p>
            </div>
            <div style={{ textAlign: "center", background: "rgba(245,197,24,0.1)", borderRadius: 20, padding: "16px 28px", border: "1px solid rgba(245,197,24,0.2)" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#f5c518" }}>{overallScore}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Overall score</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {liveWeather && <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>☀️ {liveWeather.temp}°C right now</span>}
            {liveAqi && <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🌬️ AQI {liveAqi.aqi} · {scoreLabel("air", liveAqi.score)}</span>}
            <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🏠 Avg rent {details.avgRent}</span>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
          {/* Metrics */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Liveability Metrics</h3>
            {WEIGHTS.map((w) => {
              const val = w.key === "weather" && liveWeather ? liveWeather.score
                : w.key === "air" && liveAqi ? liveAqi.score
                : city.metrics[w.key];
              return (
                <div key={w.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{w.icon} {w.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f5c518" }}>{scoreLabel(w.key, val)}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ height: 6, borderRadius: 6, background: "linear-gradient(90deg, #f5c518, #e8a020)" }} />
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Radar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Radar View</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
                <Radar dataKey="score" stroke="#f5c518" fill="#f5c518" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
          {/* Top companies */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>💼 Top Employers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {details.topCompanies.map((co, i) => (
                <motion.div key={co} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #f5c518, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0a0a1a" }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{co}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Neighbourhoods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🏘️ Neighbourhood Guide</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {details.neighbourhoods.map((n) => (
                <div key={n.name} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{n.name}</span>
                    <div>
                      <span style={{ fontSize: 11, color: "#f5c518", fontWeight: 600 }}>1BHK ₹{(n.rent1bhk / 1000).toFixed(0)}K</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 4px" }}>·</span>
                      <span style={{ fontSize: 11, color: "#f5c518", fontWeight: 600 }}>2BHK ₹{(n.rent2bhk / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{n.vibe}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(245,197,24,0.07)", borderRadius: 12, border: "1px solid rgba(245,197,24,0.15)" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>DID YOU KNOW</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{details.funFact}</p>
            </div>
          </motion.div>
        </div>

      </div>
      {/* Salary Benchmarks */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
  style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1.5rem" }}>
  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>💰 Salary Benchmarks</h3>
  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Annual CTC in ₹ Lakhs · 2024 estimates</p>
  <div style={{ display: "grid", gap: 10 }}>
    {(SALARY_DATA[id] || []).map((s) => (
      <div key={s.role} style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{s.role}</span>
        <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 8 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(s.max / 55) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "absolute", left: `${(s.min / 55) * 100}%`, width: `${((s.max - s.min) / 55) * 100}%`, height: 8, borderRadius: 8, background: "linear-gradient(90deg, rgba(245,197,24,0.4), #f5c518)" }} />
          <motion.div initial={{ left: 0 }} animate={{ left: `${(s.median / 55) * 100}%` }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", top: -2, width: 3, height: 12, background: "#fff", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#f5c518", minWidth: 60, textAlign: "right" }}>₹{s.min}–{s.max}L</span>
      </div>
    ))}
  </div>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
  <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
    <span>▬ Range</span>
    <span>| Median</span>
  </div>
  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>
    * Estimates based on 2024 AmbitionBox & Glassdoor data. Actual offers may vary.
  </p>
  </div>
</motion.div>

{/* Commute Score */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
  style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1.5rem" }}>
  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🚗 Commute Score</h3>
  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Average daily commute for IT professionals</p>

  {COMMUTE_DATA[id] && (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f5c518" }}>{COMMUTE_DATA[id].avgMinutes}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>avg mins/day</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f87171" }}>{COMMUTE_DATA[id].peakMinutes}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>peak hours</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#34d399" }}>{COMMUTE_DATA[id].score}/100</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>commute score</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600 }}>MAJOR IT HUBS</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {COMMUTE_DATA[id].itHubs.map(hub => (
            <span key={hub} style={{ padding: "4px 12px", borderRadius: 50, background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)", color: "#f5c518", fontSize: 12 }}>
              {hub}
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(52,211,153,0.08)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(52,211,153,0.15)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>💡 PRO TIP</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{COMMUTE_DATA[id].tip}</p>
      </div>
    </>
  )}
</motion.div>

{/* Healthcare Index */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
  style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1.5rem" }}>
  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🏥 Healthcare Index</h3>
  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Quality & accessibility of medical facilities</p>

  {HEALTHCARE_DATA[id] && (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Health score", value: `${HEALTHCARE_DATA[id].score}/100`, color: "#34d399" },
          { label: "Hospitals", value: HEALTHCARE_DATA[id].hospitals, color: "#f5c518" },
          { label: "Avg consult fee", value: `₹${HEALTHCARE_DATA[id].avgConsultFee}`, color: "#a78bfa" },
          { label: "Ambulance ETA", value: `${HEALTHCARE_DATA[id].ambulanceResponse} min`, color: "#f87171" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600 }}>TOP HOSPITALS</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HEALTHCARE_DATA[id].topHospitals.map(h => (
            <span key={h} style={{ padding: "4px 12px", borderRadius: 50, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: 12 }}>
              {h}
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(167,139,250,0.08)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(167,139,250,0.15)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>💡 HEALTHCARE TIP</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{HEALTHCARE_DATA[id].tip}</p>
      </div>
    </>
  )}
</motion.div>

    </div>
  );
}