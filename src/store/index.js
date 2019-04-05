import Vue from 'vue';
import Vuex from 'vuex';

import account from '@/store/modules/account';
import config from '@/store/modules/config';
import notifications from '@/store/modules/notifications';
import upload from '@/store/modules/upload';

import projects from '@/store/modules/projects';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    account,
    config,
    notifications,
    upload,
    ...projects,
  },
  strict: debug,
});