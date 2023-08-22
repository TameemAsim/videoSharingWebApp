import React, { FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate
} from 'react-router-dom';

import HomePage from './pages/homePage';
import MyAccountPage from './pages/myAccountPage';
import SubscriptionVideosPage from './pages/subscriptionsPage';
import TrendingVideosPage from './pages/trendingPage';
import UploadVideoPage from './pages/uploadVideoPage';
import ViewVideoPage from './pages/viewVideoPage';
import SignInPage from './pages/signInPage';
import SignUpPage from './pages/signUpPage';
import ViewUserPage from './pages/viewUserPage';
import UpdateVideoPage from './pages/updateVideoPage';
import SearchByTagsPage from './pages/searchByTagsPage';
import SearchPage from './pages/searchPage';
import DeleteVideoPage from './pages/deleteVideoPage';
import Header from './components/layout/header';


const App: FC  =  () => {
  
  function ResistSearchError() {
    const {query} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      setTimeout(() => {
        navigate(`/search/${query}`);
      }, 500);
    }, [])

    return (
      <div className='h-screen w-screen'>
        <Header />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/signIn' Component={SignInPage} />
        <Route path='/signUp' Component={SignUpPage} />
        <Route path='/account' Component={MyAccountPage} />
        <Route path='/subscriptions' Component={SubscriptionVideosPage} />
        <Route path='/trending' Component={TrendingVideosPage} />
        <Route path='/tags/:tag' Component={SearchByTagsPage} />
        <Route path='/search/:query' Component={SearchPage} />
        <Route path='/resistSearchError/:query' Component={ResistSearchError} />
        <Route path='/uploadVideo' Component={UploadVideoPage} />
        <Route path='/viewVideo/:videoId/:uploadedAt' Component={ViewVideoPage} />
        <Route path='/updateVideo/:videoId' Component={UpdateVideoPage} />
        <Route path='/deleteVideo/:videoId' Component={DeleteVideoPage} />
        <Route path='/viewUser/:userId' Component={ViewUserPage} />
      </Routes>
    </Router>
  );
}

export default App;