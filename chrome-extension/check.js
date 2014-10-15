var companys = {
    "yuantong": "圆通速递",
    "shentong": "申通快递",
    "zhongtong": "中通快递",
    "yunda": "韵达快递",
    "shunfeng": "顺丰速运",
    "zhaijisong": "宅急送",
    "ems": "EMS",
    "tiantian": "天天快递",
    "suer": "速尔快递",
    "youshuwuliu": "优速物流",
    "quanfengkuaidi": "全峰快递",
    "debangwuliu": "德邦",
    "aae": "AAE全球专递",
    "auspost": "澳大利亚邮政",
    "aramex": "Aramex",
    "huitongkuaidi": "百世汇通",
    "youzhengguonei": "包裹信件",
    "bpost": "比利时邮政",
    "citylink": "City-Link",
    "coe": "COE",
    "dhl": "DHL中国件",
    "dhlde": "DHL德国件",
    "disifang": "递四方",
    "emsguoji": "EMS国际件",
    "fedex": "FedEx国际件",
    "vancl": "凡客配送",
    "fanyukuaidi": "凡宇快递",
    "fedexcn": "Fedex",
    "fedexus": "FedEx美国件",
    "guotongkuaidi": "国通快递",
    "ganzhongnengda": "能达速递",
    "gongsuda": "共速达",
    "koreapost": "韩国邮政",
    "huaqikuaiyun": "华企快运",
    "jiajiwuliu": "佳吉快运",
    "jd": "京东快递",
    "canpost": "加拿大邮政",
    "jiayunmeiwuliu": "加运美",
    "jialidatong": "嘉里大通",
    "jinguangsudikuaijian": "京广速递",
    "kuayue": "跨越速递",
    "kuaijiesudi": "快捷速递",
    "kuaiyouda": "四川快优达",
    "minbangsudi": "民邦速递",
    "minghangkuaidi": "民航快递",
    "ocs": "OCS",
    "ontrac": "OnTrac",
    "quanritongkuaidi": "全日通",
    "quanyikuaidi": "全一快递",
    "quanchenkuaidi": "全晨快递",
    "quanjitong": "全际通",
    "japanposten": "日本邮政",
    "rufengda": "如风达",
    "swisspost": "瑞士邮政",
    "shenganwuliu": "圣安物流",
    "shengfengwuliu": "盛丰物流",
    "shenghuiwuliu": "盛辉物流",
    "tnt": "TNT",
    "ups": "UPS",
    "usps": "USPS",
    "wanjiawuliu": "万家物流",
    "wanxiangwuliu": "万象物流",
    "hkpost": "香港邮政",
    "xinbangwuliu": "新邦物流",
    "xinfengwuliu": "信丰物流",
    "youzhengguoji": "邮政国际包裹",
    "yuanchengwuliu": "远成物流",
    "ytkd": "运通中港快递",
    "ztky": "中铁物流",
    "zhongyouwuliu": "中邮物流",
    "zengyisudi": "增益速递"
};

var state = {
    "0": "在途，即货物处于运输过程中",
    "1": "揽件，货物已由快递公司揽收并且产生了第一条跟踪信息",
    "2": "疑难，货物寄送过程出了问题",
    "3": "签收，收件人已签收",
    "4": "退签，即货物由于用户拒签、超区等原因退回，而且发件人已经签收",
    "5": "派件，即快递正在进行同城派件",
    "6": "退回，货物正处于退回发件人的途中"
};

var url = "http://api.open.baidu.com/pae/channel/data/asyncqury?appid=4001";
//&com=yunda&nu=1201442261956";

function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

function get_and_update(request_url) {
    httpRequest(request_url, function(result) {
        var json_result = JSON.parse(result);
        var html_result = document.getElementById("result");
        html_result.innerHTML = '';
        if (json_result.status != '0') {
            var msg_text = document.createTextNode(json_result.msg);
            var msg_element = document.createElement("p");
            msg_element.appendChild(msg_text);
            html_result.appendChild(msg_element);
        } else {
            var state_detail = state[json_result.data.info.state];
            var ul = document.createElement("ul");
            var state_element = document.createElement("li");
            state_element.setAttribute("id","state");
            var state_text = document.createTextNode("快递状态:" + state_detail);
            state_element.appendChild(state_text);
            ul.appendChild(state_element);
            html_result.appendChild(ul);

            for (var i = 0; i < json_result.data.info.context.length; i++) {
                var trans_element = document.createElement("li");
                trans_element.setAttribute("class","trans");
                var trans_date = new Date(parseInt(json_result.data.info.context[i].time) * 1000);
                var trans_desc = json_result.data.info.context[i].desc;
                var trans_break_line = document.createElement("br");
                var trans_date_text = document.createTextNode(trans_date.toLocaleString());
                var trans_desc_text = document.createTextNode(trans_desc);

                trans_element.appendChild(trans_date_text);
                trans_element.appendChild(trans_break_line);
                trans_element.appendChild(trans_desc_text);

                ul.appendChild(trans_element);

            }
        }
    });

}


var add = document.getElementById('add');
add.onclick = function() {
    var old = JSON.parse(localStorage.tickets || "[]");

    var comp = document.getElementById("comp").value;
    var num = document.getElementById("num").value;
    old.push({
        company: comp,
        number: num
    });

    var items = document.getElementById("item_show").childNodes[0];
    var item = document.createElement("li");
    item.setAttribute("class", "item");
    item.setAttribute("num", num);
    item.setAttribute("comp", comp);
    var text = document.createTextNode(companys[comp] + ":" + num);
    item.appendChild(text);


    item.onclick = function() {
        var request_url = url + "&com=" + this.getAttribute("comp") + "&nu=" + this.getAttribute("num");
        get_and_update(request_url);

    };

    
    items.appendChild(item);

    var request_url = url + "&com=" + comp + "&nu=" + num;

    get_and_update(request_url);

    localStorage.tickets = JSON.stringify(old);
    console.log(localStorage.tickets);
    return false;
};


var del = document.getElementById("del");
del.onclick = function() {
    localStorage.tickets = '';
    var items = document.getElementById("item_show");
    items.childNodes[0].innerHTML = '';
    var html_result = document.getElementById("result");
    html_result.childNodes[0].innerHTML = '';
    var input = document.getElementById("num");
    input.value = '';
    return false;
};

window.onload = function() {
    var old = JSON.parse(localStorage.tickets || "[]");
    var items = document.getElementById("item_show");
    var ul = document.createElement("ul");
    for (var i = 0; i < old.length; i++) {
        tmp = document.createElement("li");
        tmp.setAttribute("class", "item");
        tmp.setAttribute("num", old[i].number);
        tmp.setAttribute("comp", old[i].company);
        text = document.createTextNode(companys[old[i].company] + ":" + old[i].number);
        tmp.appendChild(text);
        ul.appendChild(tmp);
    }
    items.appendChild(ul);

    if (old.length == 1) {

        var request_url = url + "&com=" + old[0].company + "&nu=" + old[0].number;
        get_and_update(request_url);

    }

    var items_html = document.getElementsByClassName("item");
    for (var i = 0; i < items_html.length; i++) {
        items_html[i].onclick = function() {
            var request_url = url + "&com=" + this.getAttribute("comp") + "&nu=" + this.getAttribute("num");
            get_and_update(request_url);

        };
    }
};