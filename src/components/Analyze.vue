<script>
import Nar from './Nar.vue';
export default({
    components: { Nar }
})

</script>

<template>
    <div>
        <Nar></Nar>
        <div class="ana">
            <img src="./static/picture/wcloud.png" alt="wcloud" class="wcloud">
            <img src="./static/picture/C1.png" alt="c1" class="child">
            <img src="./static/picture/C2.png" alt="c2" class="child">
            <img src="./static/picture/C3.png" alt="c3" class="child">
            <img src="./static/picture/C4.png" alt="c4" class="child">

            

            <img src="./static/picture/T1.png" alt="t1" class="child">
            <img src="./static/picture/T2.png" alt="t2" class="child">
            <img src="./static/picture/T3.png" alt="t3" class="child">
            <img src="./static/picture/T4.png" alt="t4" class="child">
        </div>
    </div>
</template>
<style>
.ana{
    display: flex;
    flex-wrap: wrap;
}
.wcloud{
    margin: 0 auto;
    transform:scale(0.7);
}
.child{
    width: 50%;
}
</style>
    