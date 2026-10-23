import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Heart, Plus, X, Search, Clock3, Utensils, ChevronRight, ArrowLeft, Check, Sparkles, SlidersHorizontal, CookingPot, Leaf, Sun, CloudRain, Snowflake, ThermometerSun, MapPin, LocateFixed } from 'lucide-react';
import { Route, Switch } from 'wouter';
import NotFound from '@/pages/not-found';

type Weather = 'sunny' | 'rainy' | 'cold' | 'warm';
type Recipe = {
  id: string; title: string; description: string; duration: number; servings: number;
  ingredients: string[]; steps: string[]; days: string[]; weather: Weather[];
  tags: string[]; image: string; color: string; accent: string;
};

const recipes: Recipe[] = [
  { id:'tomato-orzo', title:'Jammy tomato orzo', description:'A one-pan, almost risotto-ish supper with sweet burst tomatoes and a little lemon lift.', duration:25, servings:2, ingredients:['orzo','cherry tomatoes','garlic','olive oil','parmesan','lemon','basil'], steps:['Warm a generous glug of olive oil in a wide pan. Add sliced garlic and let it turn fragrant, not brown.','Tip in the tomatoes with a pinch of salt. Let them slump and pop for 6–8 minutes.','Stir through the orzo, then add 2 cups of hot water. Simmer, stirring often, until glossy and tender.','Finish with lemon zest, parmesan and torn basil. Add a splash of water if it needs loosening.'], days:['Monday','Tuesday','Wednesday','Thursday'], weather:['sunny','warm'], tags:['One pan','Vegetarian'], image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85', color:'#efc785',accent:'#e7613c' },
  { id:'crispy-chickpeas', title:'Crispy chickpea bowls', description:'Golden spiced chickpeas, cool yogurt and whatever crunchy greens are waiting in the drawer.', duration:30, servings:2, ingredients:['chickpeas','yogurt','cucumber','lemon','olive oil','paprika','rice'], steps:['Heat the oven to 220°C / 425°F. Pat chickpeas dry and toss with olive oil, paprika and salt.','Roast for 22–25 minutes, shaking the tray once, until crisp at the edges.','Stir lemon juice and a pinch of salt into the yogurt. Slice cucumber into cool, crunchy ribbons.','Pile chickpeas over warm rice, spoon over lemon yogurt and finish with cucumber and olive oil.'], days:['Monday','Tuesday','Wednesday','Thursday','Friday'], weather:['sunny','warm'], tags:['Plant-forward','Easy'], image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85', color:'#d7d7a2',accent:'#df7547' },
  { id:'cozy-lentils', title:'Cozy lentil soup', description:'Slow-simmered, lemony comfort with a warm piece of toast for the last spoonfuls.', duration:40, servings:4, ingredients:['lentils','carrot','onion','garlic','vegetable stock','lemon','olive oil'], steps:['Dice the onion and carrot. Soften them in olive oil with a good pinch of salt for 8 minutes.','Add minced garlic and lentils; stir for a minute, then pour in the stock.','Simmer gently for 25–30 minutes, until the lentils are soft but still hold their shape.','Squeeze in lemon, taste for salt, and serve with a final ribbon of olive oil.'], days:['Monday','Tuesday','Wednesday','Thursday','Sunday'], weather:['rainy','cold'], tags:['Comfort food','Batch-friendly'], image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85', color:'#d89b64',accent:'#b74c34' },
  { id:'green-frittata', title:'Fridge-door frittata', description:'A soft, herb-flecked frittata for odds and ends. Very forgiving, deeply satisfying.', duration:22, servings:2, ingredients:['eggs','spinach','feta','onion','olive oil','potato'], steps:['Whisk the eggs with a pinch of salt and crumble in the feta.','Soften onion in an oven-safe pan. Add spinach and any cooked potato; stir until wilted.','Pour in the eggs and cook over low heat until the edges set, about 5 minutes.','Finish under a hot grill for 2 minutes. Rest briefly, then slice into generous wedges.'], days:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], weather:['sunny','warm'], tags:['Quick','Waste less'], image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85', color:'#e6c879',accent:'#58825f' },
  { id:'mushroom-toast', title:'Garlicky mushroom toast', description:'Deeply browned mushrooms piled on crisp toast with thyme and a soft, savory edge.', duration:18, servings:2, ingredients:['mushrooms','bread','garlic','butter','thyme','parmesan'], steps:['Slice mushrooms and heat a skillet until properly hot. Add butter and mushrooms in one uncrowded layer.','Leave them alone for a few minutes to get golden, then toss and cook until tender.','Add garlic, thyme and a knob more butter. Season generously and stir until glossy.','Toast thick slices of bread. Pile mushrooms on top and shave over parmesan.'], days:['Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], weather:['rainy','cold'], tags:['Quick','Comfort food'], image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85', color:'#d6b190',accent:'#79523c' },
  { id:'lemon-chicken', title:'Lemon & herb chicken tray', description:'The kind of easy oven supper that makes the whole kitchen smell like a Sunday.', duration:45, servings:4, ingredients:['chicken','potato','lemon','garlic','rosemary','olive oil'], steps:['Heat oven to 210°C / 410°F. Cut potatoes into bite-sized pieces and toss with oil and salt.','Nestle chicken pieces over the potatoes. Add lemon wedges, crushed garlic and rosemary.','Roast for 35–40 minutes, turning the potatoes once, until the chicken is cooked through.','Rest for 5 minutes, then squeeze over the roasted lemon and bring the tray to the table.'], days:['Wednesday','Thursday','Friday','Saturday','Sunday'], weather:['cold','rainy'], tags:['One pan','Family table'], image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=85', color:'#e4b775',accent:'#ac593b' },
  { id:'peanut-noodles', title:'Sesame peanut noodles', description:'Slippery noodles, a tangy peanut sauce and a bright tangle of whatever veg you have.', duration:20, servings:2, ingredients:['noodles','peanut butter','soy sauce','lime','carrot','cucumber','sesame'], steps:['Cook noodles according to the packet, then rinse under cool water.','Whisk peanut butter, soy, lime juice and a splash of warm water until silky.','Use a peeler to make ribbons from the carrot and cucumber. Toss everything together.','Scatter over sesame seeds and an extra squeeze of lime. Eat straight from the bowl.'], days:['Monday','Tuesday','Wednesday','Thursday','Friday'], weather:['warm','sunny'], tags:['Quick','Vegetarian'], image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85', color:'#e6ba77',accent:'#cf5737' },
];
const suggestions = ['eggs','tomatoes','spinach','chickpeas','rice','lemon','mushrooms','potatoes','garlic','yogurt'];
const dayOptions = ['Any day','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const weatherOptions: {id: Weather; label:string; Icon: typeof Sun}[] = [
  {id:'sunny',label:'Sunny',Icon:Sun},{id:'rainy',label:'Rainy',Icon:CloudRain},{id:'cold',label:'Cold',Icon:Snowflake},{id:'warm',label:'Warm',Icon:ThermometerSun},
];
const normalize = (value: string) => value.trim().toLowerCase().replace(/s$/, '');

type Forecast = { location: string; condition: string; high: number; mood: Weather };
type ForecastResponse = {
  daily?: {
    weather_code?: number[];
    temperature_2m_max?: number[];
    precipitation_probability_max?: number[];
  };
};

function describeWeatherCode(code: number) {
  if (code === 0) return 'Clear skies';
  if (code === 1) return 'Mostly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorms';
  return 'Cloudy';
}

async function loadForecast(latitude: number, longitude: number, location: string): Promise<Forecast> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'weather_code,temperature_2m_max,precipitation_probability_max',
    forecast_days: '1',
    timezone: 'auto',
  }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error('We couldn’t load the forecast. Try again or use a weather filter below.');

  const data = await response.json() as ForecastResponse;
  const code = data.daily?.weather_code?.[0];
  const high = data.daily?.temperature_2m_max?.[0];
  const rainChance = data.daily?.precipitation_probability_max?.[0] ?? 0;
  if (!Number.isFinite(code) || !Number.isFinite(high)) {
    throw new Error('Today’s forecast isn’t available for that location. Try another city or use a weather filter below.');
  }

  const weatherCode = Number(code);
  const highTemperature = Number(high);
  let mood: Weather;
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86;
  if (isSnow || highTemperature <= 10) {
    mood = 'cold';
  } else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || weatherCode >= 95 || rainChance >= 50) {
    mood = 'rainy';
  } else if (highTemperature >= 25) {
    mood = 'warm';
  } else if (weatherCode === 0 || weatherCode === 1) {
    mood = 'sunny';
  } else {
    mood = highTemperature >= 18 ? 'warm' : 'cold';
  }

  return { location, condition: describeWeatherCode(weatherCode), high: highTemperature, mood };
}

function App() {
  const [ingredients, setIngredients] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('whats-cooking-pantry') || '["tomatoes","garlic","lemon","eggs"]'); } catch { return ['tomatoes','garlic','lemon','eggs']; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('whats-cooking-favorites') || '[]'); } catch { return []; }
  });
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('Any day');
  const [manualWeather, setManualWeather] = useState<Weather | ''>('');
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { localStorage.setItem('whats-cooking-pantry', JSON.stringify(ingredients)); }, [ingredients]);
  useEffect(() => { localStorage.setItem('whats-cooking-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => {
    if (selected) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selected]);
  const weather = manualWeather || forecast?.mood || '';
  const findForecastForCity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = city.trim();
    if (!search) {
      setWeatherError('Enter a city to look up its forecast.');
      return;
    }
    setWeatherLoading(true);
    setWeatherError('');
    try {
      const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
      url.search = new URLSearchParams({ name: search, count: '1', language: 'en', format: 'json' }).toString();
      const response = await fetch(url);
      if (!response.ok) throw new Error('We couldn’t search for that city. Try again or use a weather filter below.');
      const results = await response.json() as { results?: { name: string; admin1?: string; country?: string; latitude: number; longitude: number }[] };
      const place = results.results?.[0];
      if (!place) throw new Error('We couldn’t find that city. Try adding a region or country.');
      const placeLabel = [place.name, place.admin1, place.country].filter(Boolean).filter((part, index, all) => all.indexOf(part) === index).join(', ');
      const nextForecast = await loadForecast(place.latitude, place.longitude, placeLabel);
      setForecast(nextForecast);
      setManualWeather('');
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : 'Something went wrong while loading the forecast. You can still use a weather filter below.');
    } finally {
      setWeatherLoading(false);
    }
  };
  const useMyLocation = () => {
    setWeatherError('');
    if (!navigator.geolocation) {
      setWeatherError('Location sharing isn’t available in this browser. Search for a city or choose a weather filter below.');
      return;
    }
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const nextForecast = await loadForecast(coords.latitude, coords.longitude, 'Your location');
        setForecast(nextForecast);
        setManualWeather('');
      } catch (error) {
        setWeatherError(error instanceof Error ? error.message : 'We couldn’t load the forecast. Search for a city or use a weather filter below.');
      } finally {
        setWeatherLoading(false);
      }
    }, (error) => {
      setWeatherLoading(false);
      setWeatherError(error.code === error.PERMISSION_DENIED
        ? 'Location access was declined. Search for a city or choose a weather filter below.'
        : 'We couldn’t get your location. Search for a city or choose a weather filter below.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 1800000 });
  };
  const addIngredient = (name: string) => {
    const clean = name.trim().toLowerCase();
    if (clean && !ingredients.some((item) => normalize(item) === normalize(clean))) setIngredients((current) => [...current, clean]);
    setQuery('');
  };
  const ranked = useMemo(() => recipes
    .map((recipe) => ({ recipe, matches: recipe.ingredients.filter((ingredient) => ingredients.some((item) => normalize(item) === normalize(ingredient))) }))
    .filter(({recipe,matches}) => matches.length > 0 && (!day || day === 'Any day' || recipe.days.includes(day)) && (!weather || recipe.weather.includes(weather)) && (!showFavorites || favorites.includes(recipe.id)))
    .sort((a,b) => b.matches.length - a.matches.length || a.recipe.duration - b.recipe.duration), [ingredients,day,weather,showFavorites,favorites]);
  const searchMatches = query.trim() ? suggestions.filter((item) => item.includes(query.toLowerCase()) && !ingredients.includes(item)).slice(0,5) : [];
  const toggleFavorite = (id:string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current,id]);

  return <div className="app-shell">
    <header className="topbar">
      <a href="/" className="brand" aria-label="What's Cooking home"><span className="brand-mark"><CookingPot size={19}/></span><span>what’s cooking<span className="brand-dot">.</span></span></a>
      <div className="topbar-note"><span className="status-dot"/> YOUR KITCHEN, YOUR NEXT GOOD MEAL</div>
      <button className={`saved-link ${showFavorites ? 'is-active' : ''}`} onClick={() => setShowFavorites((v)=>!v)} data-testid="button-show-favorites"><Heart size={16} fill={showFavorites ? 'currentColor' : 'none'}/><span>{showFavorites ? 'All ideas' : 'Saved'}</span><b>{favorites.length}</b></button>
    </header>

    <main>
      {!selected ? <>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line"/> A LITTLE INSPIRATION FOR TONIGHT</p>
            <h1>Good things<br/>are <em>already</em><br/>in your kitchen.</h1>
            <p className="hero-sub">Tell us what’s hanging around. We’ll help you make something lovely.</p>
            <div className="hero-foot"><span className="sketch-arrow">↘</span><span>Start with what you have</span></div>
          </div>
          <div className="hero-art" role="img" aria-label="Fresh tomatoes, herbs and lemons on a kitchen counter">
            <div className="art-note">a note from<br/>your kitchen</div><span className="art-stamp">MAKE<br/>SOMETHING<br/>GOOD</span>
          </div>
        </section>

        <section className="workspace">
          <aside className="pantry-panel">
            <div className="section-kicker"><span>01</span><span>WHAT’S IN THE FRIDGE?</span><span className="kicker-rule"/></div>
            <h2>Build your<br/><em>little list.</em></h2>
            <p className="panel-copy">A few things are all it takes. Add what you have and we’ll do the delicious bit.</p>
            <div className="ingredient-entry">
              <div className="input-wrap"><Search size={17}/><input ref={inputRef} value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault();addIngredient(query)}}} placeholder="Try “spinach” or “rice”" aria-label="Add an ingredient" data-testid="input-ingredient"/><button onClick={()=>addIngredient(query)} aria-label="Add ingredient" data-testid="button-add-ingredient"><Plus size={18}/></button></div>
              {searchMatches.length>0 && <div className="autocomplete">{searchMatches.map((item)=><button key={item} onClick={()=>addIngredient(item)} data-testid={`suggestion-${item}`}>{item}<Plus size={14}/></button>)}</div>}
            </div>
            <div className="ingredient-chips" aria-live="polite">{ingredients.length ? ingredients.map((item)=><span className="ingredient-chip" key={item} data-testid={`ingredient-${item}`}>{item}<button onClick={()=>setIngredients((current)=>current.filter((x)=>x!==item))} aria-label={`Remove ${item}`} data-testid={`remove-${item}`}><X size={13}/></button></span>) : <p className="empty-pantry">Your list is clear. Add an ingredient to get started.</p>}</div>
            <div className="suggestions"><p className="micro-label">A FEW GOOD STARTERS</p><div className="starter-list">{suggestions.filter((item)=>!ingredients.includes(item)).slice(0,6).map((item)=><button key={item} onClick={()=>addIngredient(item)} data-testid={`starter-${item}`}><Plus size={12}/>{item}</button>)}</div></div>
            {ingredients.length>0 && <button className="clear-pantry" onClick={()=>setIngredients([])} data-testid="button-clear-pantry">Clear your list</button>}
            <div className="pantry-quote"><Leaf size={17}/><span>Good cooking starts<br/>with what’s already here.</span></div>
          </aside>

          <section className="results-panel">
            <div className="results-header">
              <div><div className="section-kicker"><span>02</span><span>{showFavorites ? 'YOUR LITTLE RECIPE BOX' : 'A GOOD PLACE TO START'}</span><span className="kicker-rule"/></div><h2>{showFavorites ? <>Saved with <em>love.</em></> : <>Tonight, <em>sorted.</em></>}</h2><p className="results-sub">{showFavorites ? 'The recipes you’ve tucked away for later.' : 'Matched to your kitchen, ranked by what you’ve got.'}</p></div>
              <div className="result-count"><strong>{ranked.length.toString().padStart(2,'0')}</strong><span>{ranked.length===1?'RECIPE':'RECIPES'}<br/>TO TRY</span></div>
            </div>
            <section className="weather-tools" aria-label="Local forecast suggestions">
              <div className="weather-tools-main">
                <div className="weather-tool-heading"><span className="weather-tool-icon"><CloudRain size={17}/></span><div><p>COOK WITH THE WEATHER</p><span>Use today’s forecast to tune your recipe ideas.</span></div></div>
                <div className="weather-location-actions">
                  <form onSubmit={findForecastForCity} className="city-search"><MapPin size={15}/><input value={city} onChange={(event)=>setCity(event.target.value)} placeholder="Enter a city" aria-label="Enter a city for the forecast" data-testid="input-weather-city"/><button type="submit" disabled={weatherLoading} data-testid="button-weather-city">{weatherLoading?'Loading…':'Find city'}</button></form>
                  <button type="button" className="location-button" onClick={useMyLocation} disabled={weatherLoading} data-testid="button-use-location"><LocateFixed size={14}/>{weatherLoading?'Loading…':'Use my location'}</button>
                </div>
              </div>
              {forecast ? <div className="weather-status" aria-live="polite" data-testid="status-weather-forecast">
                <span className="forecast-details"><span className="forecast-pin"><MapPin size={13}/></span><span><strong>{forecast.location}</strong> · {forecast.condition} · high {Math.round(forecast.high)}°C</span><span className="forecast-mood">Forecast mood: {weatherOptions.find((option)=>option.id===forecast.mood)?.label}</span>{manualWeather && <span className="forecast-mood manual-mood">Manual filter: {weatherOptions.find((option)=>option.id===manualWeather)?.label}</span>}</span>
                <div className="forecast-actions">{manualWeather && <button type="button" onClick={()=>setManualWeather('')} data-testid="button-use-forecast">Use forecast mood</button>}<button type="button" onClick={()=>setForecast(null)} data-testid="button-clear-forecast">Clear forecast</button></div>
              </div> : <p className="weather-hint">Location is optional. Manual weather filters are always available below.</p>}
              {weatherError && <p className="weather-error" role="alert" data-testid="status-weather-error">{weatherError}</p>}
            </section>
            <div className="filters">
              <label className="day-select"><SlidersHorizontal size={15}/><select value={day} onChange={(e)=>setDay(e.target.value)} aria-label="Filter by day" data-testid="select-day">{dayOptions.map((option)=><option key={option}>{option}</option>)}</select></label>
              <span className="filter-divider"/>
              <div className="weather-filters" aria-label="Filter by weather mood">{weatherOptions.map(({id,label,Icon})=><button key={id} className={weather===id?'selected':''} onClick={()=>setManualWeather(manualWeather===id?'':id)} aria-pressed={weather===id} data-testid={`filter-${id}`}><Icon size={14}/><span>{label}</span></button>)}</div>
            </div>
            {ranked.length ? <div className="recipe-grid">{ranked.map(({recipe,matches},index)=><RecipeCard key={recipe.id} recipe={recipe} matches={matches} favorite={favorites.includes(recipe.id)} onFavorite={()=>toggleFavorite(recipe.id)} onOpen={()=>setSelected(recipe)} index={index}/>)}</div> :
              <div className="empty-state"><div className="empty-illustration"><CookingPot size={34}/><span>?</span></div><p className="empty-eyebrow">{showFavorites ? 'NOT TUCKED AWAY YET' : 'A QUIET LITTLE KITCHEN'}</p><h3>{showFavorites ? 'No saved recipes, just yet.' : ingredients.length ? 'Nothing quite clicks.' : 'Let’s find your first meal.'}</h3><p>{showFavorites ? 'Tap the heart on a recipe to keep it close.' : ingredients.length ? 'Try another filter or add a couple more things from your kitchen.' : 'Add a few ingredients above, and we’ll find something lovely.'}</p>{showFavorites ? <button onClick={()=>setShowFavorites(false)} className="text-action">Back to suggestions <ChevronRight size={15}/></button> : <button onClick={()=>{setDay('Any day');setManualWeather('');setForecast(null);setIngredients(['eggs','spinach','garlic'])}} className="text-action">Try eggs, spinach & garlic <ChevronRight size={15}/></button>}</div>
            }
            <div className="results-endnote"><span className="tiny-star">✳</span><span>Cook with curiosity. Use what you have. Make it yours.</span><span className="tiny-star">✳</span></div>
          </section>
        </section>
        <footer><span>WHAT’S COOKING? <i>Good food, no fuss.</i></span><span>MADE FOR THE “WHAT’S IN THE FRIDGE?” MOMENT</span></footer>
      </> : <RecipeDetail recipe={selected} matches={selected.ingredients.filter((ingredient)=>ingredients.some((item)=>normalize(item)===normalize(ingredient)))} favorite={favorites.includes(selected.id)} onFavorite={()=>toggleFavorite(selected.id)} onBack={()=>setSelected(null)}/>}
    </main>
  </div>;
}

function RecipeCard({recipe,matches,favorite,onFavorite,onOpen,index}:{recipe:Recipe;matches:string[];favorite:boolean;onFavorite:()=>void;onOpen:()=>void;index:number}) {
  return <article className="recipe-card" style={{'--card-color':recipe.color,'--card-accent':recipe.accent,'--delay':`${index*70}ms`} as CSSProperties} data-testid={`card-recipe-${recipe.id}`}>
    <button className="card-image" onClick={onOpen} style={{backgroundImage:`url("${recipe.image}")`}} aria-label={`Open ${recipe.title}`} data-testid={`open-image-${recipe.id}`}><span className="image-label">{recipe.tags[0]}</span></button>
    <button className={`heart-button ${favorite?'favorited':''}`} onClick={onFavorite} aria-label={favorite?'Remove from saved':'Save recipe'} data-testid={`favorite-${recipe.id}`}><Heart size={17} fill={favorite?'currentColor':'none'}/></button>
    <button className="card-main" onClick={onOpen} data-testid={`open-recipe-${recipe.id}`}><div className="card-meta"><span><Clock3 size={13}/>{recipe.duration} MIN</span><span className="match-score">{matches.length} OF {recipe.ingredients.length} ON HAND</span></div><h3>{recipe.title}</h3><p>{recipe.description}</p><div className="matched-list">{matches.slice(0,4).map((item)=><span key={item}>{item}</span>)}</div><span className="card-open">View recipe &amp; steps <ChevronRight size={15}/></span></button>
  </article>;
}

function RecipeDetail({recipe,matches,favorite,onFavorite,onBack}:{recipe:Recipe;matches:string[];favorite:boolean;onFavorite:()=>void;onBack:()=>void}) {
  return <section className="recipe-detail">
    <button className="back-link" onClick={onBack} data-testid="button-back"><ArrowLeft size={16}/> BACK TO YOUR IDEAS</button>
    <div className="detail-hero">
      <div className="detail-image" style={{backgroundImage:`url("${recipe.image}")`}}><span>{recipe.tags.join(' · ')}</span></div>
      <div className="detail-intro"><p className="eyebrow"><span className="eyebrow-line"/> A LITTLE SOMETHING FOR THE TABLE</p><h1>{recipe.title.split(' ').slice(0,-1).join(' ')} <em>{recipe.title.split(' ').slice(-1)}</em></h1><p>{recipe.description}</p><div className="detail-stats"><span><Clock3 size={15}/>{recipe.duration} minutes</span><span><Utensils size={15}/>Serves {recipe.servings}</span></div><button className={`save-recipe ${favorite?'saved':''}`} onClick={onFavorite} data-testid="button-detail-favorite"><Heart size={16} fill={favorite?'currentColor':'none'}/>{favorite?'Saved to your recipe box':'Save for later'}</button></div>
    </div>
    <div className="detail-columns"><section className="detail-ingredients"><div className="section-kicker"><span>01</span><span>WHAT YOU’LL NEED</span></div><h2>The good <em>bits.</em></h2><p className="have-note"><Check size={14}/>{matches.length} things already in your kitchen</p><ul>{recipe.ingredients.map((item)=><li key={item}><span className={matches.some((match)=>normalize(match)===normalize(item))?'have-it':''}>{item}</span>{matches.some((match)=>normalize(match)===normalize(item))&&<small>IN YOUR KITCHEN</small>}</li>)}</ul></section><section className="detail-steps"><div className="section-kicker"><span>02</span><span>COOKING STEPS · {recipe.steps.length} TOTAL</span></div><h2>Follow the <em>steps.</em></h2><ol>{recipe.steps.map((step,index)=><li key={step}><span className="step-number">{String(index+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol><div className="cook-note"><Sparkles size={17}/><span>Make it your own. The best version is the one you enjoy.</span></div></section></div>
  </section>;
}

function Root() { return <Switch><Route path="/" component={App}/><Route component={NotFound}/></Switch>; }
export default Root;
