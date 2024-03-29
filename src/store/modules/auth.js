import AuthService from '@/services/authService'; // Crie um serviço para gerenciar a autenticação e chamadas de API
import jwtDecode from 'jwt-decode'; 

const state = {
    isAuthenticated: localStorage.getItem('IS_AUTHENTICATED_KEY') || sessionStorage.getItem('IS_AUTHENTICATED_KEY') || false,
    token: localStorage.getItem('USER_AUTH_KEY') || sessionStorage.getItem('USER_AUTH_KEY') || null,
    user: null,
    persist: false,
  };

const mutations = {
  setIsAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
    if(!isAuthenticated){
        localStorage.removeItem('IS_AUTHENTICATED_KEY');
        sessionStorage.removeItem('IS_AUTHENTICATED_KEY');
    }
  },
  setUser(state, user) {
    state.user = user;
  },
  setPersist(state, persist) {
    state.persist = persist;
    localStorage.setItem('PERSIST_OPT', persist);
  },
  setToken(state, token) {
    state.token = token;
    if(!token){
        localStorage.removeItem('USER_AUTH_KEY');
        sessionStorage.removeItem('USER_AUTH_KEY');
    }
  },
};

const actions = {
    updateToken({ commit}, token) {
        commit('setToken', token);
        const decodedToken = jwtDecode(token);
        commit('setUser', decodedToken);
        AuthService.storeTokenLocally(token);
    },
  async login({ commit }, { email, password, persist }) {
     try {
        const token = await AuthService.login(email, password);
        commit('setIsAuthenticated', true);
        commit('setToken', token);
        commit('setPersist', persist);
        const decodedToken = jwtDecode(token);
        if (AuthService.isTokenExpired(token)) {
            commit('setUser', null); 
            return Promise.reject('Token has expired');
        } else {
            commit('setUser', decodedToken.user);
        }
        if (persist) {
           AuthService.storeTokenLocally(token);
        } else {
           AuthService.storeTokenSession(token);
        }
        return Promise.resolve('Login successful');
    } catch (error) {
        return Promise.reject(error.message || 'Login failed');
    }
  },
  async register({ commit }, {name, email, password, persist }) {
    try {
       const token = await AuthService.register(name, email, password);
       commit('setIsAuthenticated', true);
       commit('setToken', token);
       commit('setPersist', persist);
       const decodedToken = jwtDecode(token);
       if (AuthService.isTokenExpired(token)) {
           commit('setUser', null); 
           return Promise.reject('Token has expired');
       } else {
           commit('setUser', decodedToken.user);
       }
       if (persist) {
          AuthService.storeTokenLocally(token);
       } else {
          AuthService.storeTokenSession(token);
       }
       return Promise.resolve('Registration Successful');
   } catch (error) {
       return Promise.reject(error.message || 'Registration failed');
   }
  },         
  async fetchUserData({ commit, state }) {
    if (!state.user) {
      const token = state.token || localStorage.getItem('USER_AUTH_KEY') || sessionStorage.getItem('USER_AUTH_KEY');
      if (token) {
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;
        commit('setUser', user);
        return user;
      }
      return null;
    }
    return state.user;
  },
  logout({ commit }) {
    commit('setIsAuthenticated', false);
    commit('setToken', null);
  },
};

const getters = {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    token: state => state.token,
};
export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
