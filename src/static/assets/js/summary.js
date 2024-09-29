var app = new Vue({
	el:"#app",
	data: {
		message:"请输入文本"
	},

    methods:{
        example1:function (){        
            var that = this;
            that.message = "针对经典Otsu算法、最大熵算法、最小交叉熵算法等在低信噪比图像中分割效果较差的问题,从图像复杂度的角度提出了基于图像背景与目标的对象复杂度的图像分割方法,并采用曲线拟合方法大大减少了计算冗余,提高了算法的实时性与稳定性";
        },

         example2:function (){
            var that = this;
            that.message =  "详细阐述了分布式网络中数据一致性维护的研究内容和目标,综合运用分布式数据存储技术、对等网络可靠传输技术、分布式共识机制技术、非对称加密技术搭建了一个决策权高度分散的去中心化网络模型"
        },

        example3:function (){
            var that = this;
            that.message = "针对传统图像拼接算法不适用于局部特征点多的微观图像实时拼接问题,结合Harris角点、SURF算法和KMeans算法提出了一种改进的算法";
        },
        buttonclick:function(){
            $('#json').text("");        
            var that = this;
            console.log(that.message);
             axios.get('http://39.100.48.36:3002/predict_summary?sentence='+that.message).then(function(response){
                console.log(response.data);
                var data=JSON.stringify(response.data.summary_content);
                console.log(typeof(data));
                $('#json').text(data);
                          
        },function(err){
            console.log(err);
             });
        }
    }

})