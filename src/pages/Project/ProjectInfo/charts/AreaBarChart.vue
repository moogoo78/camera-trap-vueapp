<template>
  <div class="area-chart">
    <table>
      <tbody>
        <tr
          v-for="(data, index) in displayItems"
          :key="`trow-${index}`"
          :class="{ 'is-active': data.id === activeCameraId }"
          @click="clickRow(data.path)"
        >
          <th>{{ data.name }}</th>
          <td
            v-for="(result, rid) in data.result"
            :key="`retrievedStatus-${rid}`"
            :class="chartType"
          >
            <span v-if="result === 1" class="is-complete"></span>
            <span v-else-if="result === 2" class="not-complete"></span>
            <span v-else-if="result === 3" class="is-cancel"></span>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <td>1 月</td>
          <td>2 月</td>
          <td>3 月</td>
          <td>4 月</td>
          <td>5 月</td>
          <td>6 月</td>
          <td>7 月</td>
          <td>8 月</td>
          <td>9 月</td>
          <td>10 月</td>
          <td>11 月</td>
          <td>12 月</td>
        </tr>
      </tfoot>
    </table>
    <chart-legend :type="chartType" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ChartLegend from '@/pages/Project/ProjectInfo/charts/ChartLegend';

const studyAreas = createNamespacedHelpers('studyAreas');
const projects = createNamespacedHelpers('projects');

export default {
  name: 'area-bar-chart',
  components: {
    ChartLegend,
  },
  props: {
    activeCameraId: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...projects.mapGetters(['getRetrievalData', 'getIdentifiedData']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
    chartType: function() {
      return this.$route.params.type;
    },
    displayItems: function() {
      if (this.selectedStudyAreaId === 'all') {
        // all areas: list all parent areas in this project
        return this.studyAreas.map(({ id, title, children }) => ({
          id,
          name: title,
          path: children && children.length > 0 ? children[0].id : id,
          result:
            this.chartType === 'retrieved'
              ? this.getRetrievalData({ year: this.year, id })
              : this.getIdentifiedData({ year: this.year, id }),
        }));
      } else {
        // single area: list all cameras in this area
        return this.cameraLocations.map(({ id, name }) => ({
          id,
          name,
          path: id,
          result:
            this.chartType === 'retrieved'
              ? this.getRetrievalData({ year: this.year, id })
              : this.getIdentifiedData({ year: this.year, id }),
        }));
      }
    },
  },
  methods: {
    clickRow(path) {
      const params = {
        projectId: this.projectId,
        selectedStudyAreaId: path,
        type: this.chartType,
      };
      if (this.selectedStudyAreaId !== 'all') {
        params.selectedStudyAreaId = this.selectedStudyAreaId;
        params.selectedCameraId = path;
      }
      this.$router.push({
        name: 'projectMedia',
        params,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.area-chart {
  margin-top: 20px;

  table {
    position: relative;
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      width: 60px;
      position: relative;
      padding: 5px 0;
      font-size: 13px;
      font-weight: 400;
    }

    td {
      position: relative;
      padding: 5px 0;
      font-size: 13px;
      font-weight: 400;
    }

    tbody {
      tr {
        cursor: pointer;
      }
      td {
        border-left: 1px solid #dbdbdb;
      }
    }

    tfoot {
      color: #8b8b8b;

      td {
        text-align: center;
      }
    }
  }

  td > span {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
    height: 19px;
    width: calc(100% + 2px);
    margin-left: -1px;
    &.is-complete {
      background: #bfe08e;
    }
    &.not-complete {
      background: #faa6b4;
    }
    &.is-cancel {
      background: #8c9cab;
    }
  }

  td.identified > span {
    &.is-complete {
      background: #aacaee;
    }
    &.not-complete {
      background: #8c9cab;
    }
  }

  tr.is-active,
  tr:hover {
    td > span {
      border-top: 1px solid #bfe08e;
      border-bottom: 1px solid #bfe08e;
    }
    td > span.is-complete {
      background: #2a7f60;
    }

    td.identified > span {
      border: 0px;
    }
    td.identified > span.is-complete {
      background: #5895da;
    }
  }
}
</style>
