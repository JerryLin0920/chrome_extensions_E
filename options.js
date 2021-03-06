
const chromep = new ChromePromise();

let page = $("#settingInput");

function getNewLine(index, item = {name:'', url:''}) {
  let nameBlock = $("<div class='col-sm-3 '></div>");
  let targetBlock = $("<div class='col-sm-6 '></div>");

  let line = $("<div class='form-group row'></div>");
  let functionBtn = $("<div class='col-sm-1 '></div>");
  let delBtn = $("<a class='btn btn-danger delete-btn'>刪除</a>");
  delBtn.click(() => {
    delBtn.parent().parent().remove();
  });

  // let cb = $("<input class='form-control' type='checkbox' />").attr("checked", item.enabled).attr("name", `enabled_${index}`);

  let sort = $("<input type='number' class='form-control' placeholder='sort' />").val(
      item.sort).attr("name", `sort_${index}`);
  let name = $("<input class='form-control' placeholder='name' />").val(
      item.name).attr("name", `name_${index}`);
  let target = $("<input class='form-control' placeholder='target' />").val(
      item.target).attr("name", `target_${index}`);
  line
  .append(functionBtn.clone().append(delBtn))
  .append(functionBtn.clone().append(sort))
  .append(nameBlock.append(name))
  .append(targetBlock.append(target));
  return line;

}


function constructOptions() {
  //先取出資料
  chromep.storage.sync.get("allData")
  .then(storeData => {
    let allData;
    //判斷資料是否存在
    if (!!storeData && !!storeData.allData) {
      allData = storeData.allData;
    } else {
      let code = $("#code").val();
      if (!!settings[code]) {
        allData = settings[code];
      } else {
        allData = settings.default;
      }
    }

    page.empty();
    allData = allData.sort(sortData);
    let index = 0;
    for (let item of allData) {

      page.append(getNewLine(index, item));
      index++;
    }
  })
}

//Save Btn
$("#save").click(function () {
  let allData = [];
  $("#settingInput :input").each(function (index, dom) {
    /*
    * collect input value
    * ex: name = name_1, url_1, name_2, url_2
    * */
    let name = dom.name.split("_");
    if (name.length > 1) {
      let arrayIndex = name[1];
      let data = allData[arrayIndex];
      if (!data) {
        data = {};
      }
      if (!!dom.value) {
        Object.assign(data, {[name[0]]: dom.value});
        allData[arrayIndex] = data;
      }
    }
  });
  //get Max Sort Value
  let sortArray = allData.map(obj => isNaN(obj.sort) ? undefined : parseInt(obj.sort));
  let index = Math.max(...sortArray.filter(obj => !!obj));

  allData
  //filter empty
  .filter(obj => Object.keys(obj).length > 0)
  .sort(sortData)
  .forEach((obj) => {
    if (!obj.sort) {
      obj.sort = ++index;
    }
  });
  //save option
  chromep.storage.sync
  .set({allData: allData.filter(obj => Object.keys(obj).length > 0)})
  .then(() => {
    constructOptions();
    return Promise.resolve();
  })
  .then(function () {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  })
});
//Reset Btn
$("#reset").click(() => {
  chromep.storage.sync.clear()
  .then(() => {
    constructOptions();
    return Promise.resolve();
  })
  .then(() => {
    let status = document.getElementById('status');
    status.textContent = 'Options reset.';
    //setDefault option
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  })

});

$("#add").click(() => {
  let index = parseInt($("#settingInput :input:last").attr("name").split("_")[1]) + 1;
  console.log(index); //FIXME DEBUG LOG
  page.append(getNewLine(index));
});

function sortData (o1, o2) {
  if (!o1.sort) {
    return 1;
  } else if (!o2.sort) {
    return -1;
  }
  return o1.sort > o2.sort ? 1 : -1;
}

//initPageSetting
document.addEventListener('DOMContentLoaded', constructOptions);


const settings = {
  default: [
    {sort:1, name: 'Ig_ID/ "%s"', target: 'https://www.instagram.com/%s'},
    {sort:2, name: 'twitter_ID', target: 'https://twitter.com/%s'},
    {sort:3, name: 'Facebook_search/ "%s"',target: 'https://www.facebook.com/search/top/?q=%s'}
  ],
  ex: [
    {sort:1, name: 'nh_搜尋/ "%s"', target: 'https://nhentai.net/search/?q=%s'},
    {sort:2, name: '紳士_搜尋/ "%s"', target: 'https://wnacg.com/albums-index-page-1-sname-%s.html'},
    {sort:3, name: 'e熊貓_搜尋/ "%s"', target: 'https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=%s'},
    {sort:4, name: 'ex熊貓_搜尋/ "%s"', target: 'https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=%s'},
    {sort:5, name: 'nh_本/ "%s"', target: 'https://nhentai.net/g/%s'},
    {sort:6, name: '紳士_本_ID/ "%s"', target: 'https://wnacg.com/photos-index-aid-%s.html'},
  ]
};