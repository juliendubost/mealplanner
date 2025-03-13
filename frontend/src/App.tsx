import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export interface MealCardData {
  name: string;
  id: number;
  day: number;
  time: number;
}

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
        axios.get('http://be.mp.jujuu.xyz/meal', {
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
     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
       <CardContent sx={{ flexGrow: 1 }}>
         <Box display="flex" justifyContent="space-between" alignItems="center">
           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             {inputData.name || 'Ajouter un repas'}
           </Typography>
           <Box>
             <IconButton onClick={renewMealCard} color="primary" size="small">
               <RefreshIcon />
             </IconButton>
             <IconButton onClick={emptyMealCard} color="error" size="small">
               <DeleteIcon />
             </IconButton>
           </Box>
         </Box>
       </CardContent>
     </Card>
   );
};

const MealTable: React.FC = () => {
  const [searchParams] = useSearchParams();

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

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Header row */}
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}></Typography>
          </Grid>
          <Grid item xs={4.5}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Midi</Typography>
          </Grid>
          <Grid item xs={4.5}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Soir</Typography>
          </Grid>

          {/* Day rows */}
          {days.map((day, index) => (
            <React.Fragment key={day}>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{day}</Typography>
              </Grid>
              <Grid item xs={4.5}>
                <MealCard {...mealCards[index * 2]} />
              </Grid>
              <Grid item xs={4.5}>
                <MealCard {...mealCards[index * 2 + 1]} />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MealTable />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
