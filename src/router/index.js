import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'intro',
      component: () => import('@/pages/Intro.vue'),
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/pages/Project/index.vue'),
      children: [
        {
          path: 'overview',
          name: 'projectOverview',
          component: () => import('@/pages/Project/Overview.vue'),
        },
        {
          path: 'create',
          name: 'projectCreate',
          component: () => import('@/pages/Project/Create.vue'),
        },
        {
          path: ':projectId',
          component: () => import('@/pages/Project/Detail.vue'),
          children: [
            {
              path: '/',
              redirect: 'info',
            },
            {
              path: 'info',
              component: () =>
                import('@/pages/Project/ProjectInfo/ProjectInfo.vue'),
              children: [
                {
                  path: '/',
                  redirect: 'video/all/retrieved',
                  name: 'projectInfo',
                },
                {
                  path: 'video/:selectedStudyAreaId/:type/:selectedCameraId?',
                  name: 'projectVideo',
                  meta: { projectAside: true },
                  component: () =>
                    import('@/pages/Project/ProjectInfo/ProjectVideo.vue'),
                },
                {
                  path: 'species',
                  name: 'projectSpecies',
                  meta: { projectAside: true },
                  component: () =>
                    import('@/pages/Project/ProjectInfo/ProjectSpecies.vue'),
                },
              ],
            },
            {
              path: 'edit',
              name: 'projectEdit',
              meta: { projectAside: false },
              component: () => import('@/pages/Project/EditProject/index.vue'),
              children: [
                {
                  path: 'basic',
                  name: 'projectBasic',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Basic.vue'),
                },
                {
                  path: 'setting',
                  name: 'projectSetting',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Setting.vue'),
                },
                {
                  path: 'camera-location',
                  name: 'projectCameraLocation',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/CameraLocation.vue'),
                },
                {
                  path: 'member',
                  name: 'projectMember',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Member.vue'),
                },
                {
                  path: 'license',
                  name: 'projectLicense',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/License.vue'),
                },
              ],
            },
            {
              path: 'study-areas/:studyAreaId',
              name: 'projectStudyAreasView',
              meta: { projectAside: true },
              component: () =>
                import('@/pages/Project/ProjectStudyAreas/index.vue'),
            },
            {
              path: 'upload',
              name: 'projectUpload',
              meta: { projectAside: false },
              component: () =>
                import('@/pages/Project/ProjectUpload/index.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/upload-history',
      component: () => import('@/pages/UploadHistory/index.vue'),
    },
    // 篩選及下載
    {
      path: '/download',
      component: () => import('@/pages/Download/index.vue'),
      children: [
        {
          path: '/',
          redirect: 'search',
        },
        {
          path: 'search',
          component: () => import('@/pages/Download/Search.vue'),
        },
        {
          path: 'results',
          component: () => import('@/pages/Download/Results.vue'),
        },
        {
          path: 'calculate',
          component: () => import('@/pages/Download/Calculate.vue'),
        },
      ],
    },
    {
      path: '/setting',
      component: () => import('@/pages/Setting/index.vue'),
    },
    {
      path: '/help',
      component: () => import('@/pages/Help/index.vue'),
      children: [
        {
          path: 'faq',
          component: () => import('@/pages/Help/Faq.vue'),
        },
        {
          path: 'contact-us',
          component: () => import('@/pages/Help/ContactUs.vue'),
        },
        {
          path: 'privacy',
          component: () => import('@/pages/Help/Privacy.vue'),
        },
        {
          path: 'contribution-protocol',
          component: () => import('@/pages/Help/ContributionProtocol.vue'),
        },
        {
          path: 'member-description',
          component: () => import('@/pages/Help/MemberDescription.vue'),
        },
      ],
    },
  ],
});
