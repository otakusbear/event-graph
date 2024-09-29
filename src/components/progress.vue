<template>
    <div>
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        progress: 0
        };
    },
    mounted() {
        setInterval(() => {
            if (this.progress < 100) {
                this.progress++;
            }
        }, 1000);
    }
};
</script>

<style>
.progress-bar {
    width: 0;
    height: 20px;
    background-color: blue;
    transition: width 1s;
}
</style>