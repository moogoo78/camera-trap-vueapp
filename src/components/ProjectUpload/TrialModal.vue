<template>
  <div class="modal trial-modal fade" :class="{ in: open }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <carousel
            :perPage="1"
            :value="currentPage"
            :paginationActiveColor="'#8AC731'"
          >
            <slide>
              <img
                src="/assets/upinfo/carousel-1.png"
                width="467"
                srcset="/assets/upinfo/carousel-1@2x.png"
              />
              <div class="caption">
                <p>
                  上傳之資料檔需至少涵蓋以下欄位：(1) 樣區 、(2)相機位置 、(3)
                  檔名 、(4) 時間、 (5) 物種
                </p>
                <small class="text-gray">
                  各計畫欄位規範請參考
                  <a class="link" @click="downloadCsvSrc">資料範本</a>
                </small>
              </div>
            </slide>
            <slide>
              <img
                src="/assets/upinfo/carousel-2.png"
                width="467"
                srcset="/assets/upinfo/carousel-2@2x.png"
              />
              <div class="caption">
                <p>
                  可上傳的檔案形式包含：(1) 內含資料檔及其對應影像之壓縮檔、(2)
                  影像壓縮檔、(3) 單一影像檔、(4) 單一資料檔。
                </p>
                <p>
                  ZIP 檔案限制：只能一個 csv、不能有資料夾、csv
                  資料數量跟影片/照片數量要一樣
                </p>
                <small class="text-gray">
                  支援格式包括壓縮檔 (ZIP)、影像檔 (JPG、MP4、AVI) 與資料檔
                  (CSV)
                  <!--a class="link">上傳格式說明</a-->
                </small>
              </div>
            </slide>
            <slide>
              <img
                src="/assets/upinfo/carousel-3.png"
                width="467"
                srcset="/assets/upinfo/carousel-1@2x.png"
              />
              <div class="caption">
                <p>
                  請將每個上傳檔案大小限制於 2G
                  以內，單一次上傳中，檔案大小總合須小於 2G 。
                </p>
                <small class="text-gray">
                  若仍有其他問題請
                  <router-link to="/help/contact-us" class="link">
                    聯絡我們
                  </router-link>
                </small>
              </div>
            </slide>
          </carousel>
          <div class="action">
            <a @click="nextSlide()" class="btn btn-orange btn-block">
              <span v-if="currentPage == 2">開始上傳</span>
              <span v-else>下一步</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';

export default {
  name: 'TrialModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Carousel,
    Slide,
  },
  watch: {
    open: 'watchToggle',
  },
  data() {
    return {
      currentPage: 0,
    };
  },
  methods: {
    watchToggle() {
      this.currentPage = 0;
    },
    nextSlide() {
      this.currentPage++;

      if (this.currentPage == 3) {
        this.$emit('close', 'trialModalOpen');
        this.currentPage = 2;
      }
    },
    downloadCsvSrc() {
      console.log(this.$router);
      //todo
    },
  },
};
</script>
