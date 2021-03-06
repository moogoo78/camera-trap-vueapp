<template>
  <div class="col-12 px-0">
    <h1 class="text-green">檔案上傳</h1>
    <div class="row">
      <div class="col-9 pr-0">
        <vue-dropzone
          id="dropzone"
          style="display: inline-block"
          :include-styling="false"
          :options="{
            url: 'localhost',
            acceptedFiles: uploadAccept,
            autoProcessQueue: false,
            previewsContainer: false,
          }"
          :useCustomSlot="true"
          @vdropzone-files-added="addFiles($event)"
        >
          <button class="btn btn-upload">
            <span class="icon">
              <i class="icon-add-green" />
            </span>
            <span class="text">新增上傳檔案</span>
          </button>
        </vue-dropzone>

        <div class="message is-alert" v-if="overTotalLimited">
          <div class="alert-box float-left">!</div>
          <div class="text">
            全部上傳的檔案已超過上限 2GB，建議您可以分次上傳
          </div>
        </div>

        <div class="float-right">
          <div class="checkbox checkbox-inline mb-0 mt-2">
            <input
              type="checkbox"
              name="select-all"
              id="select-all"
              value="1"
              :checked="selectedFileList.length === fileList.length"
              @change="selectAll"
            />
            <label for="select-all">全選檔案</label>
          </div>
          <span v-if="selectedFileList.length > 0">
            <span> | </span>
            <span class="btn btn-text text-gray">
              <span class="icon">
                <i class="icon-trash" />
              </span>
              <span
                class="text"
                v-if="selectedFileList.length === fileList.length"
                @click="removeFiles"
              >
                移除全部檔案
              </span>
              <span v-else class="text" @click="removeFiles">
                移除選取的檔案
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="upload-list-container">
      <div class="row mx-0">
        <div class="col-9 px-0">
          <table class="table" id="upload-list">
            <thead>
              <tr>
                <th width="40%">檔案名稱</th>
                <th>檔案大小</th>
                <th>樣區</th>
                <th width="25%">相機位置</th>
              </tr>
            </thead>
            <tbody>
              <tr
                :class="{
                  'is-selected': selectedFileList.includes(file.upload.uuid),
                }"
                v-for="file in fileList"
                :key="file.upload.uuid"
                @click="selectRow(file.upload.uuid, $event)"
              >
                <td>
                  <span
                    class="icon"
                    v-if="'image/jpeg,image/png'.includes(file.type)"
                    ><i class="icon-photo"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'text/csv'"
                    ><i class="icon-csv"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'application/zip'"
                    ><i class="icon-zip"></i
                  ></span>
                  <span class="icon" v-if="file.type === 'folder'"
                    ><i class="icon-folder"></i
                  ></span>
                  <span class="text">{{ file.name }}</span>
                </td>
                <td>
                  {{ formatFilesize(file.size) }}
                  <span v-if="overSingleLimited(file.size)">
                    <span class="alert-box">!</span>
                    <span style="color: #D80C37">超過上限 2GB</span>
                  </span>
                </td>
                <td>{{ studyAreaTitle(file.studyAreaId) }}</td>
                <td>
                  <span class="text">{{ file.cameraLocationName }}</span>
                  <span class="action">
                    <a class="del icon">
                      <i
                        class="icon-trash"
                        @click="removeFile(file.upload.uuid)"
                      />
                    </a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-3">
          <p class="text-center" v-if="!selectedFileList.length > 0">
            請選擇並編輯上傳檔案
          </p>
          <form class="form" v-else>
            <p class="text-center">
              選擇並編輯上傳檔案 ({{ selectedFileList.length }} /
              {{ fileList.length }})
            </p>
            <div class="form-group">
              <label class="required">樣區：</label>
              <v-select
                :options="siteOptions"
                label="title"
                v-model="currentSite"
                @input="setStudyArea"
                placeholder="請選擇檔案所屬樣區"
              />
            </div>
            <div class="form-group" v-if="subSiteOptions.length > 0">
              <label class="required">子樣區：</label>
              <v-select
                :options="subSiteOptions"
                label="title"
                @input="setStudyArea"
                placeholder="請選擇檔案所屬子樣區"
                resetOnOptionsChange
              />
            </div>
            <div v-if="doFetch">
              <div class="form-group" v-if="cameraOptions.length > 0">
                <label class="required">相機位置：</label>
                <v-select
                  :options="cameraOptions"
                  label="name"
                  @input="setCamera"
                  placeholder="請選擇檔案所屬相機位置"
                  resetOnOptionsChange
                />
              </div>
              <div v-else>
                此樣區尚無相機位置，
                <router-link
                  :to="{
                    name: 'projectCameraLocation',
                    params: {
                      projectId: $route.params.projectId,
                    },
                  }"
                  >建立一個新的？</router-link
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="action text-center">
      <p class="text-orange">請為每個檔案都編輯「樣區」和「相機位置」</p>
      <button
        class="btn btn-orange"
        :disabled="!canUpload"
        @click="$emit('doUpload')"
      >
        <span class="icon"><i class="icon-upload"></i></span>
        <span class="text"
          >開始上傳 <span v-if="canUpload">({{ fileList.length }})</span></span
        >
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import VueDropzone from 'vue2-dropzone';
import filesize from 'filesize';
import idx from 'idx';
import vSelect from 'vue-select';
import * as R from 'ramda';

import uploadAccept from '@/constant/uploadAccept.js';
import uploadStatus from '@/constant/uploadStatus.js';

const studyAreas = createNamespacedHelpers('studyAreas');
const TOTAL_LIMITED = 1024 * 1024 * 1024 * 5; // 5g
const SINGLE_LIMITED = 1024 * 1024 * 1024 * 2; // 2g

export default {
  components: {
    vSelect,
    VueDropzone,
  },
  props: {
    fileList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      uploadAccept,
      selectedFileList: [], // 對應 fileList 的 _.upload.uuid
      currentSite: undefined,
      doFetch: false, // 紀錄是否有請求取得相機位置用來判斷是沒有相機位置還是還沒送請求
    };
  },
  watch: {
    selectedFileList: function() {
      this.currentSite = undefined;
    },
    currentSite: function() {
      this.resetCameraLocations();
      this.doFetch = false;
    },
  },
  computed: {
    ...studyAreas.mapGetters([
      'studyAreas',
      'cameraLocations',
      'studyAreaTitle',
    ]),
    projectId: function() {
      return this.$route.params.projectId;
    },
    siteOptions() {
      return this.studyAreas;
    },
    subSiteOptions() {
      return idx(this.currentSite, _ => _.children) || [];
    },
    cameraOptions() {
      return this.cameraLocations;
    },
    canUpload() {
      return this.fileList.every(file => file.cameraLocationId);
    },
    overTotalLimited() {
      return (
        this.fileList.reduce((pre, current) => {
          pre += current.size;
          return pre;
        }, 0) > TOTAL_LIMITED
      );
    },
  },
  methods: {
    ...studyAreas.mapActions(['getProjectCameraLocations']),
    ...studyAreas.mapMutations(['resetCameraLocations']),
    overSingleLimited(size) {
      return size > SINGLE_LIMITED;
    },
    selectAll(e) {
      this.selectedFileList = e.target.checked
        ? this.fileList.map(v => v.upload.uuid)
        : [];
    },
    removeFiles() {
      // 刪除所有選取的檔案
      this.$emit(
        'change',
        this.fileList.filter(
          ({ upload: { uuid } }) => !this.selectedFileList.includes(uuid),
        ),
      );
      this.selectedFileList = [];
    },
    removeFile(targetId) {
      // 刪除指定檔案
      this.$emit(
        'change',
        this.fileList.filter(({ upload: { uuid } }) => uuid !== targetId),
      );
    },
    selectRow(uuid, e) {
      const shift = e.shiftKey;
      const ctrl = e.ctrlKey || e.metaKey;

      if (shift && !ctrl && this.selectedFileList.length > 0) {
        // 按下 shift 多選
        const startIdx = R.findIndex(
          R.pathEq(['upload', 'uuid'], this.selectedFileList[0]),
          this.fileList,
        );
        const endIdx = R.findIndex(
          R.pathEq(['upload', 'uuid'], uuid),
          this.fileList,
        );

        if (startIdx !== -1 && endIdx !== -1) {
          const firstIdx = startIdx; // 保持第一個不變
          const start = Math.min(startIdx, endIdx);
          const end = Math.max(startIdx, endIdx) + 1;

          this.selectedFileList = this.fileList.slice(start, end).reduce(
            (acc, currentVal, currentIndex) => {
              if (currentIndex + start !== firstIdx) {
                acc.push(currentVal.upload.uuid);
              }
              return acc;
            },
            [this.selectedFileList[0]],
          );
        }
      } else if (!shift && ctrl) {
        // 按下 ctrl 多選
        const idx = this.selectedFileList.indexOf(uuid);
        if (idx !== -1) {
          this.selectedFileList.splice(idx, 1);
        } else {
          this.selectedFileList.push(uuid);
        }
      } else {
        // 直接單選
        this.selectedFileList = [uuid];
      }
    },
    async setStudyArea(val) {
      // 當前選擇的樣區有以下情況就要去取得相機位置
      // 1. val.children.length === 0，這表示樣區只有一層
      // 2. val.children.length === undefined，這表示已經是子樣區了
      if (!idx(val, _ => _.children.length)) {
        await this.getProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: val.id,
        });
        this.doFetch = true;
      }
    },
    setCamera(val) {
      this.$emit(
        'change',
        this.fileList.map(file => {
          if (this.selectedFileList.includes(file.upload.uuid)) {
            // fileList 除了選取上傳之後的資訊以外還會再加上以下資訊
            file.studyAreaId = val.studyArea; // 所選取的樣區 id
            file.cameraLocationId = val.id; // 所選取的相機位置 id
            file.cameraLocationName = val.name; // 所選取的相機位置名稱
            file.uploadStatus = uploadStatus.waiting;
          }

          return file;
        }),
      );
    },
    formatFilesize(size) {
      return filesize(size);
    },
    addFiles(files) {
      this.$emit('change', R.concat(this.fileList, [...files]));
    },
  },
};
</script>
