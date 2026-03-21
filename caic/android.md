# Android App

Voice-first companion app to manage coding agents from your phone.

### Task list

All running agents at a glance — see prompt, branch, status, cost, and CI results for each task.

<img src="/screenshots/android-task-list.avif" alt="Android task list" style="max-width: 300px">

### Task detail

Follow an agent's work in real time — streamed text, tool uses, and results. Send follow-up messages, push branches, or stop the agent.

<img src="/screenshots/android-task-detail.avif" alt="Android task detail" style="max-width: 300px">

## Prerequisites

1. [Android SDK](https://developer.android.com/studio) with build-tools and platform for API 36
2. USB debugging enabled: **Settings → Developer options → USB debugging**
3. Phone connected via USB and authorized (`adb devices` shows your device)

## Build and install

```bash
# Build and install debug APK on connected device:
make android-push

# Build only (no install):
make android-build
```
