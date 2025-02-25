import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'mini.css';
import { Trash, Repeat } from 'react-bootstrap-icons';
import axios, {isCancel, AxiosError} from 'axios';
import { BrowserRouter, Router, Routes, Route, useSearchParams } from "react-router-dom";


export interface MealCardData {
  name: string;
  id: number;  // backend ID
  day: number;  // day of week, 0: monday, 6: Sunday
  time: number; // 0: lunch, 1: dinner
};


const MealCard: React.FC<MealCardData> = ({name, id, day, time}) => {


    const [inputData, setInputData] = useState<MealCardData>({ name, id, day, time });

    const [searchParams, setSearchParams] = useSearchParams();
    let searchKey = String(day) + String(time);


    const emptyMealCard = () => {
      setInputData(prevData => ({...prevData, name: ''}));
      setSearchParams(prevData => {
                    prevData.set(searchKey, '');
                    return prevData;
                });
    };

    const renewMealCard = () => {
        let tag = time ? "soir": "midi";

        axios.get('http://localhost:8000/meal', {
            params: {
              count: 1,
              tag: tag,
            }
          })
          .then(response => {
                setInputData(prevData => ({...prevData, name: response.data[0].meal}));
                setSearchParams(prevData => {
                    prevData.set(searchKey, response.data[0].meal);
                    return prevData;
                });
            }
          );
    };

   return (
   <>
        <div className="card">
         <div className="row">
          <div className="col-sm-8 col-md-8 col-lg-8">
            <h3>{inputData.name}</h3>
          </div>
          <div className="col-sm-2 col-md-2 col-lg-2">
            <button className="button refresh" onClick={ renewMealCard }><Repeat /></button>
          </div>
          <div className="col-sm-2 col-md-2 col-lg-2">
            <button className="button delete" onClick={ emptyMealCard }><Trash /></button>
          </div>
       </div>
      </div>
   </>
   );
};


const MealTable: React.FC = () => {

  const [searchParams] = useSearchParams();
  console.log("MealTable" + searchParams);

  const mealCards: MealCardData[] = [
    {name:searchParams.get("00") ?? '', id:0, day:0, time: 0},
    {name:searchParams.get("01") ?? '', id:0, day:0, time: 1},
    {name:searchParams.get("10") ?? '', id:0, day:1, time: 0},
    {name:searchParams.get("11") ?? '', id:0, day:1, time: 1},
    {name:searchParams.get("20") ?? '', id:0, day:2, time: 0},
    {name:searchParams.get("21") ?? '', id:0, day:2, time: 1},
    {name:searchParams.get("30") ?? '', id:0, day:3, time: 0},
    {name:searchParams.get("31") ?? '', id:0, day:3, time: 1},
    {name:searchParams.get("40") ?? '', id:0, day:4, time: 0},
    {name:searchParams.get("41") ?? '', id:0, day:4, time: 1},
    {name:searchParams.get("50") ?? '', id:0, day:5, time: 0},
    {name:searchParams.get("51") ?? '', id:0, day:5, time: 1},
    {name:searchParams.get("60") ?? '', id:0, day:6, time: 0},
    {name:searchParams.get("61") ?? '', id:0, day:6, time: 1},
  ];

  return (
  <>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Midi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Soir</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Lundi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[0]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[1]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Mardi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[2]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[3]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Mercredi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[4]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[5]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Jeudi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[6]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[7]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Vendredi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[8]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[9]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Samedi</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[10]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[11]} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4 col-md-4 col-md-4">
        <h1>Dimanche</h1>
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[12]} />
      </div>
      <div className="col-sm-4 col-md-4 col-md-4">
        <MealCard {...mealCards[13]} />
      </div>
    </div>
  </>
  );
};


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MealTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
