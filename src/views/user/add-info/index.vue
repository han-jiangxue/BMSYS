<script lang="ts" setup>
import { regionData } from "element-china-area-data"
import { CascaderOption } from "element-plus"
import { onMounted } from "vue"
import { getInfoAPI } from "@/api/user/add-info"

onMounted(async () => {
  await getInfoAPI()
})
</script>

<template>
  <div class="app-container">
    <el-card>
      <div class="p-5 overflow-x-auto">
        <el-form :inline="true" label-position="left">
          <el-form-item label="姓&emsp;&emsp;名">
            <el-input placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input placeholder="请输入身份证号" clearable />
          </el-form-item>
          <el-form-item label="性&emsp;&emsp;别">
            <el-checkbox-group class="w-49!">
              <el-checkbox label="男" name="type" />
              <el-checkbox label="女" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input placeholder="请输入手机号码" clearable />
          </el-form-item>
          <el-form-item label="民&emsp;&emsp;族">
            <el-input placeholder="请输入民族" clearable />
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input placeholder="请输入电子邮箱" clearable />
          </el-form-item>
          <el-form-item label="籍&emsp;&emsp;贯">
            <el-cascader placeholder="请选择籍贯" clearable :options="regionData as CascaderOption[]" class="w-49!" />
          </el-form-item>
          <el-form-item label="家庭住址">
            <el-input placeholder="请输入家庭住址" clearable />
          </el-form-item>
          <el-form-item label="现所在地">
            <el-input placeholder="请输入现所在地" clearable />
          </el-form-item>
          <el-form-item label="出生时间">
            <el-date-picker type="date" placeholder="请选择时间" class="w-49!" />
          </el-form-item>
          <el-form-item label="婚姻状况">
            <el-select placeholder="请选择婚姻状况" class="w-49!">
              <el-option label="未婚" value="1" />
              <el-option label="已婚" value="2" />
              <el-option label="离异" value="3" />
              <el-option label="丧偶" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select placeholder="请选择政治面貌" class="w-49!">
              <el-option label="中共党员" value="1" />
              <el-option label="中共预备党员" value="2" />
              <el-option label="共青团员" value="3" />
              <el-option label="群众" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="入党时间">
            <el-date-picker type="date" placeholder="请选择时间" class="w-49!" />
          </el-form-item>
          <el-form-item label="英语水平">
            <el-select placeholder="请选择英语水平" class="w-49!">
              <el-option label="CET4" value="1" />
              <el-option label="CET6" value="2" />
              <el-option label="TEM4" value="3" />
              <el-option label="TEM8" value="4" />
              <el-option label="IELTS" value="5" />
              <el-option label="其他" value="6" />
            </el-select>
          </el-form-item>
          <el-form-item label="英语分数">
            <el-input placeholder="请输入英语分数" clearable />
          </el-form-item>
          <el-form-item label="本科学校">
            <el-input placeholder="请输入本科就读学校" clearable />
          </el-form-item>
          <el-form-item label="本科专业">
            <el-input placeholder="请输入本科就读专业" clearable />
          </el-form-item>
          <el-form-item label="硕士学校">
            <el-input placeholder="请输入硕士就读学校" clearable />
          </el-form-item>
          <el-form-item label="硕士专业">
            <el-input placeholder="请输入硕士就读专业" clearable />
          </el-form-item>
          <el-form-item label="博士学校">
            <el-input placeholder="请输入博士就读学校" clearable />
          </el-form-item>
          <el-form-item label="博士专业">
            <el-input placeholder="请输入博士就读专业" clearable />
          </el-form-item>
          <el-form-item label="个人经历">
            <el-input
              placeholder="填写提示：请严格按照格式填写，从高中-至今填写，保持时间连续性，不出现假期以外的时间空档，请填写学校、学院、专业名称的全称。格式：
1.年月日-年月日，省市**中学，高中。（换行）
2.年月日-年月日，省市大学学院**专业，本科。（换行）
3.年月日-年月日，省市**单位就业并复习考研。（换行）
4.年月日-年月日，省市大学学院**专业，硕士研究生。（换行）
5.年月日-至今，省市大学学院专业，博士研究生。（换行）
……"
              type="textarea"
              class="w-125!"
              :rows="1"
              clearable
            />
          </el-form-item>
          <el-form-item label="担任学生干部或从事学生教育管理工作经历">
            <el-input
              placeholder="填写提示：填写大学以来的经历，按照重要程度从高至低填写，请填写单位、组织及职务的全称，不限项。格式：
1.年月日-年月日，担任**大学学生会主席。（换行）
2.年月日-年月日，担任大学学院学生会主席。（换行）
3.年月日-至今，担任大学学院班班长。（换行）
……"
              type="textarea"
              class="w-146!"
              :rows="1"
              clearable
            />
          </el-form-item>

          <el-form-item label="学习期间所获荣誉称号情况">
            <el-input
              placeholder="填写提示：仅填写荣誉称号或奖学金，获奖按照国家级、省级、校（市）级、院（县）级顺序逐级填写，荣誉称号写清类型、级别和全称，颁奖单位与获奖证书落款保持一致，如出现多部门共同颁奖，只写第一颁奖单位，限填6项。格式：
1.年月**日，获……荣誉称号，颁奖单位：………………。（换行）
2.年月**日，获……奖学金，颁奖单位：………………。（换行）
……"
              type="textarea"
              class="w-171!"
              :rows="1"
              clearable
            />
          </el-form-item>

          <el-form-item label="何时何地何原因受过何种处分">
            <el-input
              placeholder="格式：1.年月**日，在……，因……原因，受到……处分。
……"
              type="textarea"
              class="w-168!"
              :rows="1"
              clearable
            />
          </el-form-item>
          <el-form-item label="其他支撑材料">
            <el-input
              placeholder="填写提示：计算机等级证书、学术成果、其他个人认为需要提供的材料等
格式：
1.年月**日，获得……证书。（换行）
2.年月**日，发表……论文。（换行）
……"
              type="textarea"
              class="w-192!"
              :rows="1"
              clearable
            />
          </el-form-item>
        </el-form>
        <div class="relative left-225 bottom-60 w-60 h-60 mb--40">
          <el-upload
            class="w-60! h-60!"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="">上传正面免冠证件照1张</div>
            <div class="text-2">（1寸2.5*3.5cm，413*295像素，jpg格式</div>
            <div class="text-2">上传时jpg文件命名为“姓名+证件照”）</div>
          </el-upload>
          <div>
            <el-button type="primary" class="w-60">保存</el-button>
          </div>
          <div class="mt-2">
            <el-button type="primary" class="w-60">导出</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
