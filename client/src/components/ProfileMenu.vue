<template>
  <div class="profile-menu">
    <button class="profile-button" @click="toggleDropdown" @blur="handleBlur">
      <div class="avatar">
        {{ getInitials(currentUser.name) }}
      </div>
      <span class="profile-name">{{ currentUser.name }}</span>
      <svg
        class="chevron"
        :class="{ 'chevron-open': isDropdownOpen }"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <div v-if="isDropdownOpen" class="dropdown-menu">
      <div class="dropdown-header">
        <div class="avatar-large">
          {{ getInitials(currentUser.name) }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ currentUser.name }}</div>
          <div class="user-email">{{ currentUser.email }}</div>
        </div>
      </div>

      <div class="dropdown-divider"></div>

      <button class="dropdown-item" @mousedown.prevent="showProfileDetails">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M15 15C15 12.7909 12.3137 11 9 11C5.68629 11 3 12.7909 3 15"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        {{ t("profile.profileDetails") }}
      </button>

      <button class="dropdown-item" @mousedown.prevent="showTasks">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path
            d="M15 3H3C2.44772 3 2 3.44772 2 4V14C2 14.5523 2.44772 15 3 15H15C15.5523 15 16 14.5523 16 14V4C16 3.44772 15.5523 3 15 3Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M6 7L8 9L12 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ t("profile.myTasks") }}
        <span v-if="pendingTaskCount > 0" class="task-badge">{{
          pendingTaskCount
        }}</span>
      </button>

      <button class="dropdown-item" @mousedown.prevent="handleThemeToggle">
        <!-- Sun icon for light mode, Moon for dark -->
        <svg
          v-if="isDarkMode"
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
        >
          <circle
            cx="9"
            cy="9"
            r="4"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M9 2V1M9 17V16M2 9H1M17 9H16M4.22 4.22L3.51 3.51M14.49 14.49L13.78 13.78M4.22 13.78L3.51 14.49M14.49 3.51L13.78 4.22"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path
            d="M15 9.354A7 7 0 1 1 8.646 3C8.646 3 9 3 9 3c-1.18 2.049-1.18 4.5 0 6.354A5 5 0 0 0 15 9.354Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{
          isDarkMode ? t("profile.toggleThemeLight") : t("profile.toggleTheme")
        }}
      </button>

      <div class="dropdown-divider"></div>

      <button class="dropdown-item logout" @mousedown.prevent="handleLogout">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path
            d="M7 15H4C3.44772 15 3 14.5523 3 14V4C3 3.44772 3.44772 3 4 3H7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M11 12L15 9M15 9L11 6M15 9H7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ t("profile.logout") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { useI18n } from "../composables/useI18n";
import { useTheme } from "../composables/useTheme";

const { currentUser, logout, getInitials } = useAuth();
const { t } = useI18n();
const { toggle } = useTheme();

const isDropdownOpen = ref(false);
const isDarkMode = ref(document.documentElement.classList.contains("dark"));
const emit = defineEmits(["show-profile-details", "show-tasks"]);

const pendingTaskCount = computed(() => {
  return currentUser.value.tasks.filter((task) => task.status === "pending")
    .length;
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

const showProfileDetails = () => {
  isDropdownOpen.value = false;
  emit("show-profile-details");
};

const showTasks = () => {
  isDropdownOpen.value = false;
  emit("show-tasks");
};

const handleThemeToggle = () => {
  toggle();
  isDarkMode.value = document.documentElement.classList.contains("dark");
};

const handleLogout = () => {
  isDropdownOpen.value = false;
  logout();
};
</script>

<style scoped>
.profile-menu {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-canvas);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  box-shadow: var(--shadow-xs);
}

.profile-button:hover {
  background: var(--color-canvas-soft);
  border-color: var(--color-line-strong);
  box-shadow: var(--shadow-sm);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-500) 0%,
    var(--color-brand-700) 100%
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.6875rem;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink);
}

.chevron {
  color: var(--color-ink-subtle);
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 260px;
  background: var(--color-canvas);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: var(--color-canvas-soft);
  border-bottom: 1px solid var(--color-line);
}

.avatar-large {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-500) 0%,
    var(--color-brand-700) 100%
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9375rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--color-ink);
  font-size: 0.9375rem;
  margin-bottom: 0.125rem;
}

.user-email {
  font-size: 0.8125rem;
  color: var(--color-ink-subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-line);
  margin: 0.25rem 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-muted);
}

.dropdown-item:hover {
  background: var(--color-canvas-soft);
  color: var(--color-ink);
}

.dropdown-item svg {
  color: var(--color-ink-subtle);
  flex-shrink: 0;
}

.dropdown-item.logout {
  color: var(--color-danger-600);
}
.dropdown-item.logout svg {
  color: var(--color-danger-600);
}
.dropdown-item.logout:hover {
  background: var(--color-danger-50);
  color: var(--color-danger-700);
}

.task-badge {
  margin-left: auto;
  background: var(--color-brand-600);
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.4375rem;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}
</style>
