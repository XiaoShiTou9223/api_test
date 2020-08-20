<template>
    <el-select
            v-model="value"
            v-on:change="$emit('change', $event.target.value)"
            placeholder="请选择">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: 'c-select',
        props: {
            ds: Array,
            nf: String,
            vf: String
        },
        data() {
            return {
                value: undefined
            }
        }
    }
</script>