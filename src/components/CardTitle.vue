<template>
  <div class="title">
    <h3>
      <slot></slot>
    </h3>
  </div>
</template>
<style lang="less" scoped>
@red: #dd001b;
.title {
  padding-left: 15px;
  border-left: 2px solid @red;

  h3 {
    font-size: 17px;
    line-height: 17px;
    margin: 20px 0;
  }
}
</style>