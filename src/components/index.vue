<template>
    <div class="common-layout">
        <el-container>
            <el-header class="fixed-header">
                <AppHeader />
            </el-header>
            <el-main class="main-layout">
                <div class="layout-content">
                    <el-row :gutter="20">
                        <el-col :xs="0" :sm="6" :md="6" :lg="5" class="sidebar-col">
                            <div class="sticky-sidebar">
                                <AppSidebar />
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="18" :md="18" :lg="14">
                            <div class="feed-content">
                                <RouterView />
                            </div>
                        </el-col>
                        <!-- Right Column (Optional/Placeholder per PRD) -->
                        <el-col :xs="0" :sm="0" :md="0" :lg="5">
                           <!-- Future Right Sidebar content (Recommendations, etc.) -->
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './layout/app-header.vue';
import AppSidebar from './layout/app-side-bar.vue';
</script>

<style scoped>
.common-layout {
    min-height: 100vh;
    background-color: var(--el-bg-color-page); /* Use Element Plus page background variable */
}

.fixed-header {
    padding: 0;
    height: auto;
    position: sticky;
    top: 0;
    z-index: 100;
}

.main-layout {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    overflow: visible; /* Allow sticky elements to work */
}

.layout-content {
    width: 100%;
    max-width: 1200px;
}

.sticky-sidebar {
    position: sticky;
    top: 80px; /* Offset for header */
}

.feed-content {
    background-color: var(--el-bg-color);
    min-height: 80vh;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--el-border-color-light);
}
</style>
