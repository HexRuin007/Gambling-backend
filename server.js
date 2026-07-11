<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Gambling Addicts</title>
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: transparent !important;
            overflow: hidden;
            font-family:
                Segoe UI,
                Arial,
                sans-serif;
        }

        :root {
            --overlay-opacity: 0.82;
            --card-bg: rgba(15, 20, 31, calc(var(--overlay-opacity) * 0.74));
            --text-soft: #aeb8c6;
            --accent: #7c4dff;
        }

        #welcomeSplash {
            position: fixed;
            inset: 0;
            z-index: 200000;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 1;
            visibility: visible;
            transition:
                opacity 0.7s ease,
                visibility 0.7s ease;
        }

        #welcomeSplash.hidden {
            opacity: 0;
            visibility: hidden;
        }

        #welcomeSplash img {
            width: min(700px, 65vw);
            max-height: 70vh;
            height: auto;
            object-fit: contain;
            border-radius: 18px;
            user-select: none;
            pointer-events: none;
            box-shadow:
                0 20px 70px rgba(0, 0, 0, 0.72),
                0 0 24px rgba(255, 190, 70, 0.18);
        }

        #overlay {
            max-height: 84vh;
            position: fixed;
            left: 40px;
            top: 40px;
            width: 390px;
            min-width: 300px;
            min-height: 180px;
            text-align: center;
            background:
                radial-gradient(circle at top,
                    rgba(124, 77, 255, 0.22),
                    transparent 38%),
                rgba(8, 11, 18, var(--overlay-opacity));
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.32) !important;
            border-radius: 18px;
            color: white;
            padding-top: 14px;
            overflow: hidden;
            resize: none;
            pointer-events: auto;
            position: fixed;
        }



        #overlayContent {
            width: 100%;
            height: 100%;
            max-height: 84vh;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
        }

        #overlayContent::-webkit-scrollbar {
            width: 6px;
        }

        #overlayContent::-webkit-scrollbar-track {
            background: transparent;
        }

        #overlayContent::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.28);
            border-radius: 10px;
        }

        #dragHeader {
            background: linear-gradient(90deg,
                    rgba(124, 77, 255, 0.38),
                    rgba(59, 130, 246, 0.2));
            line-height: 25px;
            cursor: move;
            user-select: none;
            margin: -14px -14px 12px -14px;
            padding: 8px 12px;
            border-radius: 18px 18px 0 0;
            font-size: 11px;
            width: 100%;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.82);
            opacity: 0.26;
            transition: opacity 0.15s ease;
        }

        #dragHeader p {
            margin: 0;
        }

        #dragHeader:hover {
            opacity: 1;
        }

        #overlay #dragHeader {
            padding-top: 0;
            text-align: center;
            height: 25px;
            opacity: 0;
            margin-right: 10px;
            padding-bottom: 0;
            margin-bottom: 0;
            overflow: hidden;
        }

        #overlay.pinned #dragHeader {
            padding-top: 0;
            text-align: center;
            height: 25px;
            opacity: 0;
            margin-right: 10px;
            padding-bottom: 0;
            margin-bottom: 0;
            overflow: hidden;
        }

        #overlay.pinned:hover #dragHeader {
            opacity: 0.9;
        }

        #settings-icon {
            display: none;
            position: absolute;
            right: 10px;
            top: 0px;
            text-align: center;
            font-size: 17px;
            cursor: pointer;
            user-select: none;
            z-index: 1000;
            opacity: 0.72;
            transition:
                opacity 0.15s ease,
                transform 0.15s ease;
        }

        #settings-icon:hover {
            opacity: 1;
        }

        #overlay.pinned #settings-icon {
            opacity: 0;
            pointer-events: none;
        }

        #overlay.pinned:hover #settings-icon {
            opacity: 0.72;
            pointer-events: auto;
        }

        .header {
            margin-bottom: 10px;
        }

        .header-flex-box {
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 10px;
            padding-bottom: -10px;
            display: grid;
            grid-template-columns: 1fr 300px 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            align-items: center;
            gap: 10px;
        }

        .text {
            align-items: center;
            text-align: center;
        }

        .title {
            font-size: 20px;
            font-weight: 900;
            color: #f4f7fb;
        }

        .subtitle {
            font-size: 10px;
            color: var(--text-soft);
            margin-top: 2px;
        }

        .spacer {
            max-width: 135px;
        }

        .status {
            font-size: 10px;
            color: #6ee77c;
            font-weight: 900;
            text-transform: uppercase;
            text-align: center;
            padding: 5px 8px;
            border-radius: 999px;
            background: rgba(110, 231, 124, 0.1);
            border: 1px solid rgba(110, 231, 124, 0.22);
            white-space: nowrap;
            max-width: 135px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tabs {
            position: relative;
            display: flex;
            align-items: stretch;
            margin-bottom: 10px;
            padding: 0 31px;
            background: rgba(255, 255, 255, .08);
            border: 1px solid rgba(255, 255, 255, .1);
            border-radius: 10px;
            overflow: hidden;
        }

        .tabsScroller {
            display: flex;
            flex: 1;
            height: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
            scrollbar-width: none;
        }

        .tabsScroller::-webkit-scrollbar {
            display: none;
        }

        .tabScroll {
            position: absolute;
            display: flex;
            width: 28px;
            height: 100%;
            top: 0;
            z-index: 10;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
            border-radius: 0;
            background: rgba(10, 14, 23, .96);
            box-shadow: 0 0 12px rgba(0, 0, 0, .45);
        }

        .tabScroll.left {
            left: 4px;
        }

        .tabScroll.right {
            right: 4px;
        }

        .tabScroll.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .tabButton {
            flex: 0 0 108px;
            position: relative;
            z-index: 2;
            user-select: none;
            padding: 12px 10px;
            margin: 0;
            border: none;
            border-radius: 0;
            background: transparent;
            color: white;
            cursor: pointer;
            white-space: nowrap;
        }

        .tabIndicator {
            position: absolute;
            top: 0;
            left: 31px;
            width: 108px;
            height: 100%;
            background: linear-gradient(180deg, transparent, #4f35bc);
            border: 1px solid #4f35bc;
            border-radius: 10px;
            transition: transform .35s cubic-bezier(.22, 1, .36, 1);
            z-index: 1;
        }

        .tabButton:first-child {
            border-radius: 10px 0px 0px 10px;
            border-right: 0;
        }

        .tabButton:last-child {
            border-radius: 0px 10px 10px 0px;
            border-right: 0;
        }

        .tabPage {
            display: none;
        }

        .tabPage.active {
            display: block;
        }

        .heroCard,
        .panel {
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 14px;
        }

        .heroCard {
            padding: 10px 8px 12px;
            background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.08),
                    rgba(255, 255, 255, 0.035));
        }

        .panel {
            margin-top: 10px;
            padding: 11px;
        }

        .panelHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            gap: 8px;
        }

        .panelTitle {
            font-size: 19px;
            font-weight: 900;
            color: #edf2f7;
        }

        .panelHint {
            font-size: 17px;
            color: var(--text-soft);
        }

        #wheelWrap {
            display: flex;
            justify-content: center;
            margin: 4px 0 7px;
            position: relative;
        }

        #wheelPointer {
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 11px solid transparent;
            border-right: 11px solid transparent;
            border-top: 22px solid #fff;
            z-index: 2;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55));
        }

        #wheel {
            width: 214px;
            height: 214px;
            border-radius: 50%;
            position: relative;
        }

        #wheelFace {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            transition: transform 4s cubic-bezier(0.08, 0.82, 0.17, 1.05);
            box-shadow:
                inset 0 0 0 3px rgba(255, 255, 255, 0.95),
                inset 0 0 0 11px rgba(255, 255, 255, 0.13),
                0 12px 22px rgba(0, 0, 0, 0.38);
            overflow: hidden;
        }


        .wheelLabel {
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: 0 0;
            font-size: 11px;
            font-weight: 900;
            color: white;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95);
            pointer-events: none;
            z-index: 1;
            white-space: nowrap;
        }

        #wheelInner {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 78px;
            height: 78px;
            border-radius: 50%;
            background: rgba(9, 12, 20, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 24px;
            font-weight: 950;
            z-index: 3;
            box-shadow:
                0 0 0 3px rgba(255, 255, 255, 0.92),
                0 0 14px rgba(0, 0, 0, 0.55);
        }

        #wheelInner.flickering {
            animation: centrePulse 0.18s infinite alternate;
        }

        @keyframes centrePulse {
            from {
                transform: translate(-50%, -50%) scale(1);
            }

            to {
                transform: translate(-50%, -50%) scale(1.08);
            }
        }

        .bigResult {
            text-align: center;
            font-size: 22px;
            font-weight: 950;
            margin: 8px 0 3px;
        }

        .subResult {
            text-align: center;
            font-size: 11px;
            color: var(--text-soft);
            margin: 0 auto;
            max-width: 310px;
            line-height: 1.35;
        }

        .win {
            color: #6ee77c;
        }

        .loss {
            color: #ff6262;
        }

        .neutral {
            color: #ffd84d;
        }

        .row {
            display: flex;
            gap: 7px;
            align-items: center;
            margin-top: 7px;
        }

        input {
            width: 100%;
            box-sizing: border-box;
            border: none;
            border-radius: 10px;
            padding: 9px 10px;
            background: rgba(6, 9, 15, 0.72);
            color: white;
            outline: 1px solid rgba(255, 255, 255, 0.11);
            font-size: 12px;
        }

        input:focus {
            outline-color: rgba(124, 77, 255, 0.7);
            box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.13);
        }

        button {
            width: 100%;
            margin-top: 7px;
            padding: 9px 10px;
            border: none;
            border-radius: 10px;
            color: white;
            background: linear-gradient(180deg, #4c8df7, #2f6fd4);
            cursor: pointer;
            font-weight: 900;
            font-size: 12px;
        }

        button:hover:not(:disabled) {
            filter: brightness(1.08);
        }

        button.danger {
            background: linear-gradient(180deg, #e05252, #a93232);
        }

        button.green {
            background: linear-gradient(180deg, #37b45d, #268642);
        }

        button.gold {
            background: linear-gradient(180deg, #d79a28, #996715);
        }

        button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
            filter: grayscale(0.25);
        }

        .quickBetGrid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-top: 8px;
        }

        .quickBetButton {
            margin-top: 0;
            padding: 8px 4px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 11px;
        }

        .quickBetButton.selected {
            outline: 2px solid rgba(110, 231, 124, 0.82);
            background: linear-gradient(180deg, #37b45d, #268642);
        }

        .betRow,
        .historyRow,
        .bjRow {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            font-size: 12px;
            padding: 7px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .betRow:first-child,
        .historyRow:first-child,
        .bjRow:first-child {
            border-top: 0;
        }

        .betLeft {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .betRight {
            font-weight: 900;
            white-space: nowrap;
            color: #f4f7fb;
        }

        .emptyState {
            text-align: center;
            color: var(--text-soft);
            font-size: 12px;
            padding: 10px 4px;
            background: rgba(255, 255, 255, 0.035);
            border-radius: 10px;
        }

        .small {
            font-size: 10px;
            color: var(--text-soft);
            line-height: 1.4;
            margin-top: 6px;
        }

        .playerIdentityBox {
            margin-bottom: 8px;
            padding: 9px 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .playerIdentityLabel {
            font-size: 10px;
            color: #9fb0c6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .playerIdentityName {
            font-size: 15px;
            font-weight: 900;
            color: #fff;
        }

        .playerIdentityId {
            margin-top: 2px;
            font-size: 11px;
            color: #aab3bd;
        }

        .bankerOnly.hidden {
            display: none !important;
        }


        .gameBalanceLine {
            margin: 0 0 8px;
            text-align: right;
            font-size: 10px;
            font-weight: 800;
            color: #ffd84d;
            opacity: 0.92;
        }

        .gameBalanceLine span {
            color: #fff3a6;
        }

        .autoGameCountdown {
            margin: -3px 0 8px;
            text-align: right;
            font-size: 10px;
            font-weight: 800;
            color: #aeb8c6;
        }

        .autoGameCountdown.active {
            color: #6ee77c;
        }

        .autoGameCountdown.starting {
            color: #ffd84d;
        }

        .chipWallet {
            margin-bottom: 10px;
            padding: 12px;
            border-radius: 14px;
            background: linear-gradient(180deg, rgba(255, 215, 64, .13), rgba(255, 255, 255, .045));
            border: 1px solid rgba(255, 215, 64, .24);
        }

        .chipWalletTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .chipBalance {
            font-size: 24px;
            font-weight: 950;
            color: #ffd84d;
        }

        .chipRequestStatus {
            margin-top: 7px;
            font-size: 10px;
            color: var(--text-soft);
        }

        .bankerRequest {
            padding: 9px 0;
            border-top: 1px solid rgba(255, 255, 255, .09);
        }

        .bankerRequest:first-child {
            border-top: 0;
        }

        .bankerRequestActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }

        .chipResetDangerZone {
            display: none;
            margin-top: 12px;
            padding: 12px;
            border-radius: 14px;
            text-align: left;
            background: linear-gradient(
                180deg,
                rgba(224, 82, 82, 0.18),
                rgba(169, 50, 50, 0.08)
            );
            border: 1px solid rgba(255, 98, 98, 0.42);
        }

        .chipResetDangerZone.active {
            display: block;
        }

        .chipResetDangerTitle {
            font-size: 15px;
            font-weight: 950;
            color: #ff7777;
        }

        .chipResetDangerText {
            margin-top: 5px;
            font-size: 10px;
            line-height: 1.45;
            color: var(--text-soft);
        }

        #resetAllChipsButton {
            background: linear-gradient(180deg, #e05252, #8f2424);
        }

        .dailyProfitPanel {
            margin-top: 10px;
            padding: 12px;
            border-radius: 14px;
            background:
                linear-gradient(
                    180deg,
                    rgba(110, 231, 124, 0.11),
                    rgba(255, 255, 255, 0.04)
                );
            border: 1px solid rgba(110, 231, 124, 0.22);
        }

        .dailyProfitHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 10px;
        }

        .dailyProfitHeader button {
            width: auto;
            min-width: 82px;
            margin: 0;
            padding: 7px 10px;
        }

        .dailyProfitTotal {
            padding: 12px;
            text-align: center;
            border-radius: 12px;
            background: rgba(5, 8, 14, 0.52);
            border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .dailyProfitTotal span {
            display: block;
            font-size: 10px;
            color: var(--text-soft);
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .dailyProfitTotal strong {
            display: block;
            margin-top: 3px;
            font-size: 27px;
            font-weight: 950;
        }

        .dailyProfitStats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 8px;
        }

        .dailyProfitStat {
            padding: 8px 5px;
            border-radius: 9px;
            background: rgba(255, 255, 255, 0.055);
            font-size: 9px;
            color: var(--text-soft);
        }

        .dailyProfitStat strong {
            display: block;
            margin-top: 3px;
            color: white;
            font-size: 12px;
        }

        .dailyGameBreakdown {
            margin-top: 9px;
        }

        .dailyGameRow {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 7px 2px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 11px;
            text-transform: capitalize;
        }

        .dailyProfitFootnote {
            margin-top: 8px;
            font-size: 9px;
            color: var(--text-soft);
            text-align: center;
        }

        .crashArena {
            position: relative;
            height: 210px;
            overflow: hidden;
            border-radius: 16px;
            background:
                radial-gradient(circle at 50% 100%, rgba(124,77,255,.28), transparent 55%),
                linear-gradient(180deg, rgba(5,8,14,.96), rgba(16,21,35,.96));
            border: 1px solid rgba(255,255,255,.12);
        }

        .crashGrid {
            position: absolute;
            inset: 0;
            opacity: .18;
            background-image:
                linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px);
            background-size: 32px 32px;
        }

        .crashRocket {
            position: absolute;
            left: 18%;
            bottom: 24px;
            font-size: 34px;
            transform: rotate(-35deg);
            will-change: left, bottom, transform;
            filter: drop-shadow(0 0 12px rgba(255,216,77,.5));
        }

        .crashMultiplier {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 46px;
            font-weight: 950;
            text-shadow: 0 0 20px rgba(124,77,255,.6);
        }

        .crashMultiplier.crashed {
            color: #ff6262;
            animation: crashPulse .35s ease;
        }

        @keyframes crashPulse {
            50% { transform: scale(1.12); }
        }

        .crashBetStatus {
            margin-top: 8px;
            padding: 9px;
            border-radius: 10px;
            background: rgba(255,255,255,.055);
            border: 1px solid rgba(255,255,255,.09);
            font-size: 11px;
        }

        #settings {
            display: none;
        }

        #settings.open {
            display: block;
        }

        .horseTrack {
            position: relative;
            padding: 12px 10px;
            margin: 12px 0px;
            border-radius: 16px;
            background:
                linear-gradient(90deg, rgba(255, 255, 255, .10) 0 2px, transparent 2px 100%),
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, .08), transparent 22%),
                linear-gradient(180deg, #1f7a3a, #125427);
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, .18);
            box-shadow: inset 0 0 18px rgba(0, 0, 0, .45);
        }

        .horseTrack::before,
        .horseTrack::after {
            content: "";
            position: absolute;
            left: 8px;
            right: 8px;
            height: 3px;
            background: rgba(255, 255, 255, .55);
            border-radius: 99px;
            z-index: 3;
        }

        .horseTrack::before {
            top: 7px;
        }

        .horseTrack::after {
            bottom: 7px;
        }

        .horseLane {
            position: relative;
            height: 42px;
            margin: 7px 0;
            border-radius: 8px;
            background:
                repeating-linear-gradient(90deg,
                    rgba(255, 255, 255, .10) 0px,
                    rgba(255, 255, 255, .10) 1px,
                    transparent 1px,
                    transparent 26px),
                linear-gradient(180deg, #8b5a2b, #6f421f);
            border-top: 1px solid rgba(255, 255, 255, .35);
            border-bottom: 1px solid rgba(0, 0, 0, .35);
            overflow: hidden;
        }

        .horseLane::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 1px;
            background: rgba(255, 255, 255, .18);
        }

        .horseLane::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 1px;
            background: rgba(255, 255, 255, .18);
        }


        .horseDot {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) scaleX(-1);
            font-size: 24px;
            transition: left 0.12s linear;
            z-index: 5;
            filter: drop-shadow(0 3px 2px rgba(0, 0, 0, .65));
        }

        .horseDot.racing {
            display: inline-block;
            transform: scaleX(-1);
            animation: horseGallop 0.18s infinite alternate;
        }

        .horseName {
            position: absolute;
            left: 38px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            font-weight: 900;
            color: white;
            z-index: 2;
            text-shadow: 0 1px 3px rgba(0, 0, 0, .9);
            pointer-events: none;
        }

        .horseLane.winner {
            outline: 2px solid rgba(110, 231, 124, .9);
            box-shadow: 0 0 12px rgba(110, 231, 124, .35);
        }

        @keyframes horseGallop {
            from {
                transform: translateY(-58%) rotate(-4deg) scaleX(-1);
            }

            to {
                transform: translateY(-42%) rotate(4deg) scaleX(-1);
            }
        }

        .horseSelect {
            width: 100%;
            box-sizing: border-box;
            border: none;
            border-radius: 10px;
            padding: 9px 10px;
            background: rgba(6, 9, 15, 0.72);
            color: white;
            outline: 1px solid rgba(255, 255, 255, 0.11);
            font-size: 12px;
        }

        .blackjackBetStatus {
            display: none;
            margin-top: 9px;
            padding: 11px;
            border-radius: 12px;
            text-align: left;
            background: linear-gradient(
                180deg,
                rgba(55, 180, 93, 0.18),
                rgba(55, 180, 93, 0.07)
            );
            border: 1px solid rgba(110, 231, 124, 0.38);
            box-shadow: 0 0 14px rgba(110, 231, 124, 0.14);
        }

        .blackjackBetStatus.active {
            display: block;
        }

        .blackjackBetStatusTitle {
            font-size: 13px;
            font-weight: 950;
            color: #6ee77c;
        }

        .blackjackBetStatusAmount {
            margin-top: 3px;
            font-size: 18px;
            font-weight: 950;
            color: white;
        }

        .blackjackBetStatusSub {
            margin-top: 4px;
            font-size: 10px;
            color: var(--text-soft);
        }

        #bjSubmitBetButton.confirmedBet {
            background: linear-gradient(180deg, #37b45d, #268642);
            box-shadow: 0 0 14px rgba(110, 231, 124, 0.32);
        }

        #blackjackAutoCountdown.betConfirmed {
            color: #6ee77c;
            font-size: 12px;
            text-align: center;
            padding: 7px 9px;
            margin: 0 0 9px;
            border-radius: 10px;
            background: rgba(55, 180, 93, 0.11);
            border: 1px solid rgba(110, 231, 124, 0.22);
        }

        .cards {
            user-select: none;
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            margin-top: 5px;
        }

        .card {
            min-width: 28px;
            height: 38px;
            border-radius: 6px;
            background: #f7f7f7;
            color: #101522;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
            font-size: 13px;
            box-shadow: 0 2px 7px rgba(0, 0, 0, 0.24);
        }

        .card.red {
            color: #c0392b;
        }

        .cardBack {
            background: linear-gradient(135deg, #4c8df7, #7c4dff);
            color: white;
        }

        .turnGlow {
            border-radius: 10px;
            background: rgba(124, 77, 255, 0.16);
            padding: 6px;
            margin-top: 4px;
        }

        .bjActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
            margin-top: 7px;
        }

        .casinoConfirmBackdrop {
            position: fixed;
            inset: 0;
            z-index: 100000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 18px;
            background: rgba(0, 0, 0, 0.68);
            backdrop-filter: blur(3px);
        }

        .casinoConfirmBackdrop.active {
            display: flex;
        }

        .casinoConfirmModal {
            width: min(340px, calc(100vw - 36px));
            padding: 16px;
            border-radius: 16px;
            background: rgba(8, 11, 18, 0.98);
            border: 1px solid rgba(255, 98, 98, 0.35);
            box-shadow: 0 22px 65px rgba(0, 0, 0, 0.62);
            color: white;
            text-align: left;
        }

        .casinoConfirmTitle {
            font-size: 18px;
            font-weight: 950;
            color: #ff7777;
        }

        .casinoConfirmText {
            margin-top: 8px;
            font-size: 11px;
            line-height: 1.5;
            color: var(--text-soft);
        }

        .casinoConfirmActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 14px;
        }

        .casinoConfirmActions button {
            margin: 0;
        }

        .roundResultPopup {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 330px;
            max-height: 70vh;
            overflow-y: auto;
            z-index: 99999;
            padding: 14px;
            border-radius: 16px;
            background: rgba(8, 11, 18, .96);
            border: 1px solid rgba(255, 255, 255, .14);
            box-shadow: 0 20px 60px rgba(0, 0, 0, .55);
            color: white;
        }

        .roundResultPopup.hidden {
            display: none;
        }

        .roundResultTitle {
            font-size: 18px;
            font-weight: 950;
            margin-bottom: 10px;
        }

        .roundResultBody {
            font-size: 12px;
            line-height: 1.45;
        }

        .roundResultLine {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 7px 0;
            border-top: 1px solid rgba(255, 255, 255, .09);
        }

        .roundResultLine:first-child {
            border-top: 0;
        }

        .roundResultClose {
            position: absolute;
            right: 8px;
            top: 6px;
            width: auto;
            padding: 2px 8px;
            margin: 0;
            border-radius: 8px;
            background: rgba(255, 255, 255, .12);
        }

        #winOverlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
        }

        #winText {
            font-size: 48px;
            font-weight: 950;
            color: white;
            text-shadow:
                0 0 10px #ffd700,
                0 0 30px #7c4dff,
                0 0 60px #fff;
            transform: scale(.5);
        }

        #winOverlay.active {
            animation: winFade 3s ease forwards;
        }

        #winOverlay.active #winText {
            animation: winPop .7s cubic-bezier(.2, 1.5, .5, 1) forwards;
        }

        .confetti {
            position: fixed;
            top: -20px;
            width: 10px;
            height: 16px;
            pointer-events: none;
            z-index: 10000;
            animation: confettiFall linear forwards;
        }

        @keyframes winFade {

            0%,
            70% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }

        @keyframes winPop {
            0% {
                transform: scale(.3) rotate(-10deg);
            }

            70% {
                transform: scale(1.2) rotate(5deg);
            }

            100% {
                transform: scale(1);
            }
        }

        .divider {
            border: none;
            border-top: 1px solid #ccc;
            margin: 20px 0;
        }

        @keyframes confettiFall {
            0% {
                transform:
                    translateY(0) rotate(0deg);
                opacity: 1;
            }

            100% {
                transform:
                    translateY(110vh) rotate(720deg);
                opacity: 0;
            }
        }


        .sessionSpinGif {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.85);
            z-index: 100001;
            display: none;
            width: min(320px, 72vw);
            max-height: 72vh;
            object-fit: contain;
            border-radius: 18px;
            pointer-events: none;
            user-select: none;
            box-shadow:
                0 0 28px rgba(255, 216, 77, 0.45),
                0 20px 60px rgba(0, 0, 0, 0.65);
        }

        .sessionSpinGif.active {
            display: block;
            animation: sessionSpinGifShow 5s ease forwards;
        }

        @keyframes sessionSpinGifShow {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.65);
            }

            10%,
            82% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.05);
            }
        }

        .freeSpinBanner {
            display: none;
            margin: 0 0 10px;
            padding: 12px;
            border-radius: 14px;
            text-align: center;
            background:
                radial-gradient(
                    circle at center,
                    rgba(255, 216, 77, 0.30),
                    rgba(124, 77, 255, 0.14)
                );
            border: 2px solid #ffd84d;
            box-shadow:
                0 0 18px rgba(255, 216, 77, 0.50),
                inset 0 0 16px rgba(255, 216, 77, 0.12);
            animation: freeSpinGlow 0.75s ease-in-out infinite alternate;
        }

        .freeSpinBanner.active {
            display: block;
        }

        .freeSpinBannerTitle {
            font-size: 16px;
            font-weight: 950;
            color: #ffd84d;
            text-shadow: 0 0 10px rgba(255, 216, 77, 0.55);
        }

        .freeSpinBannerAmount {
            margin-top: 3px;
            font-size: 21px;
            font-weight: 950;
            color: white;
        }

        .slotMachine.freeSpinActive {
            border-color: rgba(255, 216, 77, 0.95);
            box-shadow:
                0 0 22px rgba(255, 216, 77, 0.50),
                inset 0 0 18px rgba(255, 216, 77, 0.10);
        }

        #slotSpinButton.freeSpinReady {
            background: linear-gradient(180deg, #f3c847, #b57b12);
            box-shadow: 0 0 16px rgba(255, 216, 77, 0.50);
            animation: freeSpinButtonPulse 0.8s ease-in-out infinite alternate;
        }

        .freeSpinUnlockPopup {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.75);
            z-index: 100000;
            width: min(340px, calc(100vw - 36px));
            padding: 22px 18px;
            border-radius: 20px;
            text-align: center;
            color: white;
            pointer-events: none;
            background:
                radial-gradient(circle at center,
                    rgba(255, 216, 77, 0.28),
                    rgba(23, 14, 52, 0.98) 68%);
            border: 2px solid #ffd84d;
            box-shadow:
                0 0 40px rgba(255, 216, 77, 0.70),
                0 20px 60px rgba(0, 0, 0, 0.62);
            animation: freeSpinPopup 3.6s ease forwards;
        }

        .freeSpinUnlockDragon {
            font-size: 54px;
            line-height: 1;
            margin-bottom: 7px;
            filter: drop-shadow(0 0 12px rgba(255, 216, 77, 0.65));
        }

        .freeSpinUnlockTitle {
            font-size: 22px;
            font-weight: 950;
            color: #ffd84d;
            letter-spacing: 0.7px;
        }

        .freeSpinUnlockAmount {
            margin-top: 6px;
            font-size: 28px;
            font-weight: 950;
        }

        @keyframes freeSpinGlow {
            from {
                transform: scale(1);
                box-shadow: 0 0 12px rgba(255, 216, 77, 0.35);
            }

            to {
                transform: scale(1.018);
                box-shadow: 0 0 28px rgba(255, 216, 77, 0.75);
            }
        }

        @keyframes freeSpinButtonPulse {
            from {
                transform: scale(1);
            }

            to {
                transform: scale(1.025);
            }
        }

        @keyframes freeSpinPopup {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.60);
            }

            12%,
            78% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.08);
            }
        }

        .slotMachine {
            padding: 12px;
            border-radius: 16px;
            background: linear-gradient(180deg, rgba(255, 215, 64, .12), rgba(124, 77, 255, .09));
            border: 1px solid rgba(255, 215, 64, .22);
        }

        .slotGrid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
            padding: 9px;
            border-radius: 13px;
            background: rgba(5, 8, 14, .78);
            border: 1px solid rgba(255, 255, 255, .12);
            overflow: hidden;
        }

        .slotCell {
            height: 52px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            background: linear-gradient(180deg, rgba(255, 255, 255, .13), rgba(255, 255, 255, .04));
            border: 1px solid rgba(255, 255, 255, .1);
            box-shadow: inset 0 0 12px rgba(0, 0, 0, .3);
        }

        .slotCell.winLine {
            outline: 2px solid #6ee77c;
            box-shadow: 0 0 14px rgba(110, 231, 124, .45);
        }

        .slotCell.scatterLocked {
            outline: 2px solid #ffd84d;
            box-shadow: 0 0 16px rgba(255, 216, 77, .55);
            animation: scatterLockPulse .45s ease-in-out infinite alternate;
        }

        .slotCell.scatterDropping {
            animation: scatterDrop .48s cubic-bezier(.2, .8, .2, 1);
        }

        .slotGrid.spinning .slotCell {
            animation: slotBlur .16s linear infinite alternate;
        }

        @keyframes scatterLockPulse {
            from {
                transform: scale(1);
            }

            to {
                transform: scale(1.06);
            }
        }

        @keyframes scatterDrop {
            from {
                transform: translateY(-18px);
                opacity: .45;
            }

            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slotBlur {
            from {
                transform: translateY(-3px);
                filter: blur(.2px);
            }

            to {
                transform: translateY(3px);
                filter: blur(1px);
            }
        }

        .slotStats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            margin-top: 8px;
        }

        .slotStat {
            padding: 7px;
            border-radius: 9px;
            background: rgba(255, 255, 255, .055);
            font-size: 10px;
            color: var(--text-soft);
        }

        .slotStat b {
            display: block;
            color: white;
            font-size: 13px;
            margin-top: 2px;
        }

        .slotPaytable {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            font-size: 10px;
            text-align: left;
        }

        .slotPayItem {
            padding: 7px;
            border-radius: 8px;
            background: rgba(255, 255, 255, .045);
        }

        .slotPayItem b {
            float: right;
            color: #ffd84d;
        }


        .rouletteWheel {
            position: relative;
            width: 220px;
            height: 220px;
            margin: 8px auto 12px;
            border-radius: 50%;
            background:
                conic-gradient(
                    #138a3d 0deg 9.73deg,
                    #b72d2d 9.73deg 19.46deg,
                    #171717 19.46deg 29.19deg,
                    #b72d2d 29.19deg 38.92deg,
                    #171717 38.92deg 48.65deg,
                    #b72d2d 48.65deg 58.38deg,
                    #171717 58.38deg 68.11deg,
                    #b72d2d 68.11deg 77.84deg,
                    #171717 77.84deg 87.57deg,
                    #b72d2d 87.57deg 97.30deg,
                    #171717 97.30deg 107.03deg,
                    #b72d2d 107.03deg 116.76deg,
                    #171717 116.76deg 126.49deg,
                    #b72d2d 126.49deg 136.22deg,
                    #171717 136.22deg 145.95deg,
                    #b72d2d 145.95deg 155.68deg,
                    #171717 155.68deg 165.41deg,
                    #b72d2d 165.41deg 175.14deg,
                    #171717 175.14deg 184.87deg,
                    #b72d2d 184.87deg 194.60deg,
                    #171717 194.60deg 204.33deg,
                    #b72d2d 204.33deg 214.06deg,
                    #171717 214.06deg 223.79deg,
                    #b72d2d 223.79deg 233.52deg,
                    #171717 233.52deg 243.25deg,
                    #b72d2d 243.25deg 252.98deg,
                    #171717 252.98deg 262.71deg,
                    #b72d2d 262.71deg 272.44deg,
                    #171717 272.44deg 282.17deg,
                    #b72d2d 282.17deg 291.90deg,
                    #171717 291.90deg 301.63deg,
                    #b72d2d 301.63deg 311.36deg,
                    #171717 311.36deg 321.09deg,
                    #b72d2d 321.09deg 330.82deg,
                    #171717 330.82deg 340.55deg,
                    #b72d2d 340.55deg 350.28deg,
                    #171717 350.28deg 360deg
                );
            border: 8px solid #b57b12;
            box-shadow:
                inset 0 0 0 6px rgba(255,255,255,.12),
                0 12px 30px rgba(0,0,0,.45);
            transition:
                transform 4.3s cubic-bezier(.08,.82,.17,1.05);
        }

        .rouletteWheel::after {
            content: "";
            position: absolute;
            inset: 55px;
            border-radius: 50%;
            background: #080b12;
            border: 3px solid #e4b94e;
        }

        .roulettePointer {
            position: absolute;
            left: 50%;
            top: -6px;
            transform: translateX(-50%);
            z-index: 3;
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 24px solid white;
        }

        .rouletteResult {
            position: absolute;
            inset: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            font-weight: 950;
        }

        .rouletteNumberGrid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            margin-top: 9px;
        }

        .rouletteBetButton {
            position: relative;
            margin: 0;
            min-height: 38px;
            padding: 6px 3px;
            background: #171717;
            border: 1px solid rgba(255,255,255,.12);
            overflow: visible;
        }

        .rouletteChipMarker {
            position: absolute;
            right: -5px;
            top: -7px;
            z-index: 6;
            min-width: 24px;
            height: 24px;
            padding: 0 5px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            background:
                radial-gradient(
                    circle at 35% 30%,
                    #fff5ad,
                    #e0ad2c 48%,
                    #8d5d0d 100%
                );
            border: 2px dashed rgba(92, 53, 4, 0.8);
            box-shadow:
                0 3px 8px rgba(0, 0, 0, 0.55),
                inset 0 0 0 2px rgba(255, 255, 255, 0.24);
            color: #221300;
            font-size: 8px;
            font-weight: 950;
            line-height: 1;
            pointer-events: none;
            white-space: nowrap;
        }

        .rouletteBetButton.hasPlayerBet {
            outline: 2px solid rgba(255, 216, 77, 0.8);
            box-shadow:
                0 0 12px rgba(255, 216, 77, 0.3),
                inset 0 0 8px rgba(255, 216, 77, 0.12);
        }

        .rouletteBetButton.red {
            background: #9f2929;
        }

        .rouletteBetButton.green {
            background: #18733b;
        }

        .rouletteBetButton.selected {
            outline: 3px solid #ffd84d;
            box-shadow: 0 0 14px rgba(255,216,77,.4);
        }

        .rouletteOutsideGrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 8px;
        }

        .rouletteBetList {
            margin-top: 8px;
        }

        .dealCaseGrid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 10px;
        }

        .dealCase {
            position: relative;
            height: 58px;
            margin: 0;
            padding: 0;
            border-radius: 10px;
            background: linear-gradient(180deg, #d9a52d, #9b6715);
            border: 1px solid rgba(255, 240, 170, 0.45);
            font-size: 17px;
            font-weight: 950;
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.28);
        }

        .dealCase.chosen {
            outline: 3px solid #6ee77c;
            box-shadow: 0 0 18px rgba(110, 231, 124, 0.5);
        }

        .dealCase.opened {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 255, 255, 0.12);
            color: #aeb8c6;
        }

        .dealCase.finalChosen {
            background: linear-gradient(180deg, #37b45d, #268642);
            border-color: rgba(110, 231, 124, 0.95);
            color: white;
            outline: 3px solid rgba(110, 231, 124, 0.9);
            box-shadow:
                0 0 22px rgba(110, 231, 124, 0.55),
                inset 0 0 14px rgba(255, 255, 255, 0.12);
            animation: chosenCaseReveal 0.8s ease-in-out infinite alternate;
        }

        @keyframes chosenCaseReveal {
            from {
                transform: scale(1);
            }

            to {
                transform: scale(1.04);
            }
        }

        .dealCaseValue {
            display: block;
            margin-top: 2px;
            font-size: 10px;
        }

        .dealOfferBox {
            display: none;
            margin-top: 10px;
            padding: 14px;
            border-radius: 14px;
            background: linear-gradient(
                180deg,
                rgba(124, 77, 255, 0.22),
                rgba(255, 216, 77, 0.09)
            );
            border: 1px solid rgba(255, 216, 77, 0.35);
            box-shadow: 0 0 18px rgba(255, 216, 77, 0.14);
        }

        .dealOfferBox.active {
            display: block;
        }

        .dealOfferAmount {
            font-size: 28px;
            font-weight: 950;
            color: #ffd84d;
        }

        .dealOfferActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
        }

        .dealPrizeList {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
            margin-top: 9px;
        }

        .dealPrize {
            padding: 6px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.055);
            font-size: 10px;
        }

        .minesBoard {
            display: grid;
            grid-template-columns: repeat(5, 56px);
            grid-template-rows: repeat(5, 56px);
            justify-content: center;
            gap: 7px;
            margin: 10px auto 0;
            width: max-content;
        }

        .mineTile {
            width: 56px;
            height: 56px;
            aspect-ratio: 1;
            margin: 0;
            padding: 0;
            border-radius: 10px;
            font-size: 22px;
            background:
                linear-gradient(180deg,
                    rgba(76, 141, 247, .95),
                    rgba(47, 111, 212, .95));
            border: 1px solid rgba(255, 255, 255, .17);
            box-shadow:
                inset 0 0 10px rgba(255, 255, 255, .08),
                0 4px 10px rgba(0, 0, 0, .24);
        }

        .mineTile:hover:not(:disabled) {
            transform: translateY(-1px);
        }

        .mineTile.safe {
            background:
                linear-gradient(180deg,
                    rgba(55, 180, 93, .95),
                    rgba(38, 134, 66, .95));
        }

        .mineTile.mine {
            background:
                linear-gradient(180deg,
                    rgba(224, 82, 82, .98),
                    rgba(169, 50, 50, .98));
        }

        .mineTile:disabled {
            opacity: 1;
            cursor: default;
        }

        .minesControls {
            display: grid;
            grid-template-columns: 180px 180px;
            justify-content: center;
            gap: 10px;
        }

        .minesStats {
            display: grid;
            grid-template-columns: repeat(3, 120px);
            justify-content: center;
            gap: 6px;
            margin-top: 9px;
        }

        .minesStat {
            padding: 8px 5px;
            border-radius: 9px;
            background: rgba(255, 255, 255, .055);
            color: var(--text-soft);
            font-size: 10px;
        }

        .minesStat b {
            display: block;
            margin-top: 2px;
            color: white;
            font-size: 13px;
        }

        #resizeHandle {
            position: absolute;
            width: 22px;
            height: 22px;
            right: 2px;
            bottom: 2px;
            cursor: nwse-resize;
            opacity: 0.72;
            z-index: 10001;
            background: linear-gradient(135deg,
                    transparent 0%,
                    transparent 45%,
                    rgba(255, 255, 255, 0.65) 46%,
                    rgba(255, 255, 255, 0.65) 55%,
                    transparent 56%);
        }
    </style>
</head>

<body>
    <div id="welcomeSplash">
        <img
            src="./pearadise-welcome.png"
            alt="Welcome to Peardise Casino and Resort"
        />
    </div>

    <div id="overlay">
        <div id="overlayContent">
            <div class="header">
                <div clas="header-subdiv">
                    <div id="dragHeader">
                        <p>Drag to move • corner resize</p>
                        <div id="settings-icon">⚙️</div>
                    </div>
                </div>
                <div class="header-flex-box">
                    <div class="spacer"></div>
                    <div class="text">
                        <div class="title">Pearadise Casino & Resort</div>
                        <div class="subtitle">
                            Wheel + Blackjack • Horse Racing
                        </div>

                    </div>
                    <div class="status" id="status">Disconnected</div>
                </div>
            </div>
            <div style="padding: 14px">
                <div class="tabs">
                    <div class="tabIndicator"></div>

                    <button class="tabScroll left">❮</button>
                    <div id="tabsScroller" class="tabsScroller">
                        <button id="wheelTabButton" class="tabButton active">🎡 Wheel</button>
                        <button id="blackjackTabButton" class="tabButton">🃏 Blackjack</button>
                        <button id="racingTabButton" class="tabButton">🐎 Racing</button>
                        <button id="slotsTabButton" class="tabButton">🎰 Slots</button>
                        <button id="MinesTabButton" class="tabButton">💣 Mines</button>
                        <button id="dealTabButton" class="tabButton">💼 Deal OR No Deal</button>
                        <button id="rouletteTabButton" class="tabButton">🎯 Roulette</button>
<button id="crashTabButton" class="tabButton">🚀 Crash</button>
                        <button id="chipsTabButton" class="tabButton">🪙 Chips</button>
                    </div>
                    <button class="tabScroll right">❯</button>
                </div>

                <div id="wheelPage" class="tabPage active">
                    <div class="gameBalanceLine">Balance: <span class="gameChipBalance">0 chips</span></div>
                    <div class="autoGameCountdown" id="wheelAutoCountdown">Waiting for first bet</div>
                    <div class="heroCard">
                        <div id="wheelWrap">
                            <div id="wheelPointer"></div>
                            <div id="wheel">
                                <div id="wheelFace" style="transform: rotate(0deg);"></div>
                                <div id="wheelInner">??</div>
                            </div>
                        </div>
                        <div class="bigResult" id="resultText">Waiting...</div>
                        <div class="subResult" id="resultSub">
                            Each confirmed bet rolls its own multiplier.
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">💸 Place Wheel Bet</div>
                            <div class="panelHint">Uses chips</div>
                        </div>
                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="detectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="detectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>
                        <div class="row">
                            <input id="amountInput" type="number" min="1" step="1" placeholder="Bet amount" />
                            <button id="submitBetButton" class="green">Confirm Bet</button>
                        </div>
                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="amountInput" data-amount="1000000">
                                1M
                            </button>
                            <button class="quickBetButton" data-target="amountInput" data-amount="10000000">
                                10M
                            </button>
                            <button class="quickBetButton" data-target="amountInput" data-amount="100000000">
                                100M
                            </button>
                            <button class="quickBetButton" data-target="amountInput" data-amount="1000000000">
                                1B
                            </button>
                        </div>
                        <div class="small">
                            Your bet is taken from your chip balance when submitted.
                        </div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🧾 Current Wheel Bets</div>
                            <div class="panelHint">Waiting list</div>
                        </div>
                        <div id="betsBox">
                            <div class="emptyState">No bets yet.</div>
                        </div>
                    </div>
                    <div class="panel bankerOnly" id="adminPanel">
                        <div class="panelHeader">
                            <div class="panelTitle">🔐 Wheel Banker</div>
                            <div class="panelHint">Unlock in Chips tab</div>
                        </div>
                        <button id="confirmAllButton" class="green" disabled>Confirm Wheel Bets</button>
                        <button id="spinButton" disabled>Spin Wheel</button>
                        <button id="clearRoundButton" class="danger" disabled>Clear Wheel Round</button>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Wheel Results</div>
                            <div class="panelHint">Recent spins</div>
                        </div>
                        <div id="historyBox">
                            <div class="emptyState">No spins yet.</div>
                        </div>
                    </div>
                </div>
                <div id="blackjackPage" class="tabPage">
                    <div class="gameBalanceLine">Balance: <span class="gameChipBalance">0 chips</span></div>
                    <div class="autoGameCountdown" id="blackjackAutoCountdown">Waiting for first bet</div>
                    <div class="heroCard">
                        <div class="bigResult">Blackjack Table</div>
                        <div class="subResult" id="bjTableStatus">
                            Place a chip bet, then the banker starts the round.
                        </div>
                        <div class="panel">
                            <div class="panelHeader">
                                <div class="panelTitle">🎴 Dealer</div>
                                <div class="panelHint" id="dealerTotal">Total: --</div>
                            </div>
                            <div id="dealerCards" class="cards"></div>
                            <hr class="divider">
                            <div class="panelHeader" style="margin-top: 10px;">
                                <div class="panelTitle">🧍Your Hand</div>
                                <div class="panelHint" id="bjPlayerTotal">Total: --</div>
                            </div>
                            <div id="bjPlayerCards" style="margin-top: 10px;" class="cards"></div>
                            <hr class="divider">
                            <div class="bjActions">
                                <button id="bjHitButton" disabled>Hit</button>
                                <button id="bjStandButton" class="gold" disabled>Stand</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">💰 Place Blackjack Bet</div>
                            <div class="panelHint">Blackjack pays 3:2</div>
                        </div>
                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="bjDetectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="bjDetectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>
                        <div class="row">
                            <input id="bjAmountInput" type="number" min="1" step="1"
                                placeholder="Blackjack bet amount" />
                            <button id="bjSubmitBetButton" class="green">Confirm Bet</button>
                        </div>
                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="bjAmountInput" data-amount="1000000">
                                1M
                            </button>
                            <button class="quickBetButton" data-target="bjAmountInput" data-amount="10000000">
                                10M
                            </button>
                            <button class="quickBetButton" data-target="bjAmountInput" data-amount="100000000">
                                100M
                            </button>
                            <button class="quickBetButton" data-target="bjAmountInput" data-amount="1000000000">
                                1B
                            </button>
                        </div>
                        <div id="blackjackBetStatus" class="blackjackBetStatus">
                            <div class="blackjackBetStatusTitle">✓ BET CONFIRMED</div>
                            <div id="blackjackBetStatusAmount" class="blackjackBetStatusAmount">0 chips</div>
                            <div id="blackjackBetStatusSub" class="blackjackBetStatusSub">
                                Waiting for the round to auto-start.
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">👥 Players</div>
                            <div class="panelHint" id="bjTurnText">Waiting</div>
                        </div>
                        <div id="bjPlayersBox">
                            <div class="emptyState">No blackjack players yet.</div>
                        </div>
                    </div>
                    <div class="panel bankerOnly" id="bjAdminPanel">
                        <div class="panelHeader">
                            <div class="panelTitle">🔐 Blackjack Banker</div>
                            <div class="panelHint">Same banker unlock</div>
                        </div>
                        <button id="bjConfirmAllButton" class="green" disabled>
                            Confirm Blackjack Bets
                        </button>
                        <button id="bjStartButton" disabled>Start Round</button>
                        <button id="bjResetButton" class="danger" disabled>
                            Reset Table
                        </button>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Blackjack History</div>
                            <div class="panelHint">Recent hands</div>
                        </div>
                        <div id="bjHistoryBox">
                            <div class="emptyState">No blackjack rounds yet.</div>
                        </div>
                    </div>
                </div>
                <div id="racingPage" class="tabPage">
                    <div class="gameBalanceLine">Balance: <span class="gameChipBalance">0 chips</span></div>
                    <div class="autoGameCountdown" id="racingAutoCountdown">Waiting for first bet</div>
                    <div class="heroCard">
                        <div class="bigResult">Horse Racing</div>
                        <div class="subResult" id="raceStatus">
                            Choose a horse, bet chips, then watch the race.
                        </div>
                        <div class="panelHeader">
                            <div class="panelTitle">🏁 Race Track</div>
                            <div class="panelHint" id="raceWinnerText">Waiting</div>
                        </div>
                        <div id="raceTrack" class="horseTrack">

                            <div class="emptyState">No race running.</div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🏇 Pick Your Horse</div>
                            <div class="panelHint">Winner pays x6</div>
                        </div>
                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="raceDetectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="raceDetectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>
                        <select id="raceHorseSelect" class="horseSelect">
                            <option value="">Loading horses...</option>
                        </select>
                        <div class="row">
                            <input id="raceAmountInput" type="number" min="1" step="1" placeholder="Race bet amount" />
                            <button id="raceSubmitBetButton" class="green">Confirm Bet</button>
                        </div>
                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="raceAmountInput" data-amount="1000000">
                                1M
                            </button>
                            <button class="quickBetButton" data-target="raceAmountInput" data-amount="10000000">
                                10M
                            </button>
                            <button class="quickBetButton" data-target="raceAmountInput" data-amount="100000000">
                                100M
                            </button>
                            <button class="quickBetButton" data-target="raceAmountInput" data-amount="1000000000">
                                1B
                            </button>
                        </div>
                    </div>
                    <div class="panel">
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🧾 Race Bets</div>
                            <div class="panelHint">Chosen horses</div>
                        </div>
                        <div id="raceBetsBox">
                            <div class="emptyState">No racing bets yet.</div>
                        </div>
                    </div>
                    <div class="panel bankerOnly" id="raceAdminPanel">
                        <div class="panelHeader">
                            <div class="panelTitle">🔐 Racing Banker</div>
                            <div class="panelHint">Same banker unlock</div>
                        </div>
                        <button id="raceConfirmAllButton" class="green" disabled>
                            Confirm Race Bets
                        </button>
                        <button id="raceStartButton" disabled>Start Race</button>
                        <button id="raceClearButton" class="danger" disabled>
                            Clear Race Bets
                        </button>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Racing History</div>
                            <div class="panelHint">Recent races</div>
                        </div>
                        <div id="raceHistoryBox">
                            <div class="emptyState">No races yet.</div>
                        </div>
                    </div>
                </div>

                <div id="slotsPage" class="tabPage">
                    <div class="gameBalanceLine">Balance: <span class="gameChipBalance">0 chips</span></div>
                    <div class="heroCard slotMachine" id="slotMachineCard">
                        <div id="freeSpinBanner" class="freeSpinBanner">
                            <div class="freeSpinBannerTitle">🐉 FREE SPINS READY 🐉</div>
                            <div id="freeSpinBannerAmount" class="freeSpinBannerAmount">0 FREE SPINS</div>
                        </div>
                        <div class="panelHeader">
                            <div class="panelTitle">🎰Slots Of Shame</div>
                            <div class="panelHint" id="slotModeText">Paid spin</div>
                        </div>
                        <div id="slotGrid" class="slotGrid"></div>
                        <div class="bigResult" id="slotResultText">Ready to spin</div>
                        <div class="subResult" id="slotResultSub">10 paylines • Wilds • Scatters • Bonus multipliers
                        </div>
                        <div class="slotStats">
                            <div class="slotStat">Bet<b id="slotLastBet">0</b></div>
                            <div class="slotStat">Free Spins<b id="slotFreeSpins">0</b></div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">💰 Spin</div>
                            <div class="panelHint">Gambling Addicts</div>
                        </div>
                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="slotDetectedPlayerName">Waiting for game data...</div>
                            <div class="playerIdentityId" id="slotDetectedPlayerId">Open in-game so the app can read
                                your name and ID.</div>
                        </div>
                        <div class="row">
                            <input id="slotBetInput" type="number" min="1" step="1" placeholder="Total spin bet" />
                            <button id="slotSpinButton" class="gold">Spin Reels</button>
                        </div>
                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="slotBetInput" data-amount="1000000">1M</button>
                            <button class="quickBetButton" data-target="slotBetInput"
                                data-amount="10000000">10M</button>
                            <button class="quickBetButton" data-target="slotBetInput"
                                data-amount="100000000">100M</button>
                            <button class="quickBetButton" data-target="slotBetInput"
                                data-amount="1000000000">1B</button>
                        </div>
                        <div class="small">3+ scatters award free spins. During free spins, wins receive a random bonus
                            multiplier.</div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📊 Paytable</div>
                            <div class="panelHint">Multiplier of total bet</div>
                        </div>
                        <div id="slotPaytable" class="slotPaytable"></div>
                    </div>
                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Slot History</div>
                            <div class="panelHint">Your recent spins</div>
                        </div>
                        <div id="slotHistoryBox">
                            <div class="emptyState">No slot spins yet.</div>
                        </div>
                    </div>
                </div>

                <div id="dealPage" class="tabPage">
                    <div class="gameBalanceLine">
                        Balance:
                        <span class="gameChipBalance">0 chips</span>
                    </div>

                    <div class="heroCard">
                        <div class="panelHeader">
                            <div class="panelTitle">💼 Deal OR No Deal</div>
                            <div class="panelHint" id="dealStatusText">Choose your case</div>
                        </div>

                        <div id="dealCaseGrid" class="dealCaseGrid"></div>

                        <div id="dealOfferBox" class="dealOfferBox">
                            <div class="small">THE BANKER OFFERS</div>
                            <div id="dealOfferAmount" class="dealOfferAmount">0</div>
                            <div class="dealOfferActions">
                                <button id="dealAcceptButton" class="green">DEAL</button>
                                <button id="dealRejectButton" class="danger">NO DEAL</button>
                            </div>
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🎯 Start Game</div>
                            <div class="panelHint">Choose a case first</div>
                        </div>

                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="dealDetectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="dealDetectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>

                        <div class="row">
                            <input id="dealBetInput" type="number" min="1" step="1" placeholder="Deal game bet" />
                            <button id="dealStartButton" class="gold">Start Game</button>
                        </div>

                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="dealBetInput" data-amount="1000000">1M</button>
                            <button class="quickBetButton" data-target="dealBetInput" data-amount="10000000">10M</button>
                            <button class="quickBetButton" data-target="dealBetInput" data-amount="100000000">100M</button>
                            <button class="quickBetButton" data-target="dealBetInput" data-amount="1000000000">1B</button>
                        </div>

                        <div class="small">
                            Pick your case, then open three other cases per round. Accept the banker offer or keep playing.
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">💰 Prize Multipliers</div>
                            <div class="panelHint">Based on your bet</div>
                        </div>
                        <div id="dealPrizeList" class="dealPrizeList"></div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Deal History</div>
                            <div class="panelHint">Recent games</div>
                        </div>
                        <div id="dealHistoryBox">
                            <div class="emptyState">No deal games yet.</div>
                        </div>
                    </div>
                </div>

                <div id="minesPage" class="tabPage">
                    <div class="gameBalanceLine">
                        Balance:
                        <span class="gameChipBalance">0 chips</span>
                    </div>

                    <div class="heroCard">
                        <div class="panelHeader">
                            <div class="panelTitle">💣Mines</div>
                            <div class="panelHint" id="minesStatusText">Start a game</div>
                        </div>

                        <div id="minesBoard" class="minesBoard"></div>

                        <div class="minesStats">
                            <div class="minesStat">
                                Safe Picks
                                <b id="minesSafeCount">0</b>
                            </div>
                            <div class="minesStat">
                                Multiplier
                                <b id="minesMultiplier">x1.00</b>
                            </div>
                            <div class="minesStat">
                                Cash Out
                                <b id="minesPotentialPayout">0</b>
                            </div>
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">💰 Start Mines</div>
                            <div class="panelHint">1–24 mines</div>
                        </div>

                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="minesDetectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="minesDetectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>

                        <div class="row">
                            <input id="minesBetInput" type="number" min="1" step="1" placeholder="Mines bet" />

                            <input id="minesCountInput" type="number" min="1" max="10" step="1" value="3"
                                placeholder="Mine count" />
                        </div>

                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="minesBetInput" data-amount="1000000">1M</button>
                            <button class="quickBetButton" data-target="minesBetInput"
                                data-amount="10000000">10M</button>
                            <button class="quickBetButton" data-target="minesBetInput"
                                data-amount="100000000">100M</button>
                            <button class="quickBetButton" data-target="minesBetInput"
                                data-amount="1000000000">1B</button>
                        </div>

                        <div class="minesControls">
                            <button id="minesStartButton" class="green">
                                Start Game
                            </button>

                            <button id="minesCashoutButton" class="gold" disabled>
                                Cash Out
                            </button>
                        </div>

                        <div class="small">
                            Reveal safe tiles to increase the multiplier. Hit a mine and the bet is lost.
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Mines History</div>
                            <div class="panelHint">Your recent games</div>
                        </div>

                        <div id="minesHistoryBox">
                            <div class="emptyState">No Mines games yet.</div>
                        </div>
                    </div>
                </div>

                <div id="roulettePage" class="tabPage">
                    <div class="gameBalanceLine">
                        Balance:
                        <span class="gameChipBalance">0 chips</span>
                    </div>

                    <div
                        class="autoGameCountdown"
                        id="rouletteAutoCountdown"
                    >
                        Waiting for first bet
                    </div>

                    <div class="heroCard">
                        <div class="panelHeader">
                            <div class="panelTitle">🎯Roulette</div>
                            <div class="panelHint">Single zero</div>
                        </div>

                        <div style="position:relative;width:236px;margin:auto;">
                            <div class="roulettePointer"></div>
                            <div id="rouletteWheel" class="rouletteWheel">
                                <div id="rouletteResult" class="rouletteResult">—</div>
                            </div>
                        </div>

                        <div class="bigResult" id="rouletteResultText">
                            Place your bets
                        </div>
                        <div class="subResult" id="rouletteResultSub">
                            Auto-starts 20 seconds after the first bet.
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🎲 Choose Bet</div>
                            <div class="panelHint">Multiple bets allowed</div>
                        </div>

                        <div class="playerIdentityBox">
                            <div class="playerIdentityLabel">Detected Player</div>
                            <div class="playerIdentityName" id="rouletteDetectedPlayerName">
                                Waiting for game data...
                            </div>
                            <div class="playerIdentityId" id="rouletteDetectedPlayerId">
                                Open in-game so the app can read your name and ID.
                            </div>
                        </div>

                        <div id="rouletteNumberGrid" class="rouletteNumberGrid"></div>

                        <div id="rouletteOutsideGrid" class="rouletteOutsideGrid">
                            <button class="rouletteBetButton red" data-bet-type="red">Red</button>
                            <button class="rouletteBetButton" data-bet-type="black">Black</button>
                            <button class="rouletteBetButton" data-bet-type="odd">Odd</button>
                            <button class="rouletteBetButton" data-bet-type="even">Even</button>
                            <button class="rouletteBetButton" data-bet-type="low">1–18</button>
                            <button class="rouletteBetButton" data-bet-type="high">19–36</button>
                            <button class="rouletteBetButton" data-bet-type="dozen1">1st 12</button>
                            <button class="rouletteBetButton" data-bet-type="dozen2">2nd 12</button>
                            <button class="rouletteBetButton" data-bet-type="dozen3">3rd 12</button>
                            <button class="rouletteBetButton" data-bet-type="column1">Column 1</button>
                            <button class="rouletteBetButton" data-bet-type="column2">Column 2</button>
                            <button class="rouletteBetButton" data-bet-type="column3">Column 3</button>
                        </div>

                        <div class="row">
                            <input
                                id="rouletteBetInput"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Bet amount"
                            />
                            <button id="roulettePlaceBetButton" class="green">
                                Place Bet
                            </button>
                        </div>

                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="rouletteBetInput" data-amount="1000000">1M</button>
                            <button class="quickBetButton" data-target="rouletteBetInput" data-amount="10000000">10M</button>
                            <button class="quickBetButton" data-target="rouletteBetInput" data-amount="100000000">100M</button>
                            <button class="quickBetButton" data-target="rouletteBetInput" data-amount="1000000000">1B</button>
                        </div>

                        <button id="rouletteClearBetsButton" class="danger">
                            Clear My Roulette Bets
                        </button>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">🧾 Your Bets</div>
                            <div class="panelHint">Current round</div>
                        </div>
                        <div
                            id="rouletteRoundStakeSummary"
                            class="small"
                            style="margin:0 0 7px;text-align:center;"
                        >
                            Total staked this round: 0 chips
                        </div>
                        <div id="rouletteBetsBox" class="rouletteBetList">
                            <div class="emptyState">No roulette bets yet.</div>
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">📜 Roulette History</div>
                            <div class="panelHint">Recent spins</div>
                        </div>
                        <div id="rouletteHistoryBox">
                            <div class="emptyState">No roulette spins yet.</div>
                        </div>
                    </div>
                </div>

                <div id="crashPage" class="tabPage">
                    <div class="heroCard">
                        <div class="panelHeader">
                            <div>
                                <div class="panelTitle">🚀 Solo Crash</div>
                                <div class="panelHint">
                                    Your own private round. Cash out whenever you choose.
                                </div>
                            </div>
                        </div>

                        <div class="gameBalanceLine">
                            Balance:
                            <span id="crashBalance">0</span>
                            chips
                        </div>

                        <div class="crashArena">
                            <div class="crashGrid"></div>
                            <div id="crashRocket" class="crashRocket">🚀</div>
                            <div id="crashMultiplier" class="crashMultiplier">
                                1.00×
                            </div>
                        </div>

                        <div id="crashBetStatus" class="crashBetStatus">
                            Enter a bet to begin your own Crash game.
                        </div>

                        <div class="row">
                            <input
                                id="crashBetAmount"
                                placeholder="Bet amount (e.g. 10m)"
                            />
                            <button id="crashPlaceBetButton">
                                Start Crash
                            </button>
                        </div>

                        <div class="quickBetGrid">
                            <button class="quickBetButton" data-target="crashBetAmount" data-amount="1000000">1M</button>
                            <button class="quickBetButton" data-target="crashBetAmount" data-amount="10000000">10M</button>
                            <button class="quickBetButton" data-target="crashBetAmount" data-amount="100000000">100M</button>
                            <button class="quickBetButton" data-target="crashBetAmount" data-amount="1000000000">1B</button>
                        </div>

                        <button
                            id="crashCashoutButton"
                            class="green"
                            disabled
                        >
                            Cash Out
                        </button>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div class="panelTitle">Your Crash History</div>
                        </div>

                        <div id="crashHistoryBox">
                            <div class="emptyState">
                                No Crash games yet.
                            </div>
                        </div>
                    </div>
                </div>

                <div id="chipsPage" class="tabPage">
                    <div class="chipWallet">
                        <div class="chipWalletTop">
                            <div>
                                <div class="playerIdentityLabel">Casino Chip Balance</div>
                                <div class="chipBalance" id="chipBalance">0 chips</div>
                            </div>
                            <div class="panelHint" id="chipPlayerLabel">Waiting for player...</div>
                        </div>
                        <div class="row">
                            <input id="chipRequestAmount" type="number" min="1" step="1" placeholder="Chips to buy" />
                            <button id="requestChipsButton" class="gold">Request Chips</button>
                        </div>
                        <div class="chipRequestStatus" id="chipRequestStatus">Ask the banker to approve your chip
                            purchase.</div>
                    </div>

                    <div class="panel">
                        <div class="panelHeader">
                            <div>
                                <div class="panelTitle">🏆 Top Gamblers</div>
                                <div class="panelHint">Ranked by total money spent</div>
                            </div>
                            <button id="refreshLeaderboardButton" type="button">Refresh</button>
                        </div>
                        <div id="gamblingLeaderboardBox">
                            <div class="emptyState">Loading leaderboard...</div>
                        </div>
                        <div id="myLeaderboardPosition" class="chipRequestStatus">
                            Your position will appear here.
                        </div>
                    </div>

                    <div class="panel bankerOnly">
                        <div class="panelHeader">
                            <div class="panelTitle">🔐 Banker Login</div>
                            <div class="panelHint">Chip controls</div>
                        </div>
                        <input id="adminPinInput" type="password" placeholder="Banker PIN" />
                        <button id="loginAdminButton" class="gold">Unlock Banker</button>
                    </div>

                    <div class="panel bankerOnly" id="chipBankerControls" style="display:none;">
                        <div class="panelHeader">
                            <div class="panelTitle">🪙 Give Chips</div>
                            <div class="panelHint">Server balance</div>
                        </div>
                        <input id="grantChipPlayerId" type="text" placeholder="Player ID" />
                        <input id="grantChipPlayerName" type="text" placeholder="Player name (optional)" />
                        <input id="grantChipAmount" type="number" min="1" step="1" placeholder="Chips to give" />
                        <button id="grantChipsButton" class="gold">Give Chips</button>

                        <div class="panelHeader" style="margin-top:12px;">
                            <div class="panelTitle">📥 Chip Requests</div>
                            <div class="panelHint">Approve or reject</div>
                        </div>
                        <div id="chipRequestsBox">
                            <div class="emptyState">No chip requests.</div>
                        </div>

                        <div class="panelHeader" style="margin-top:12px;">
                            <div class="panelTitle">💵 Cash Out Player</div>
                            <div class="panelHint">Remove paid chips</div>
                        </div>
                        <input id="cashoutPlayerIdInput" type="text" placeholder="Player ID" />
                        <input id="cashoutAmountInput" type="number" min="1" step="1"
                            placeholder="Amount of chips to cash out" />
                        <button id="cashoutChipsButton" class="danger">Cash Out Chips</button>
                    </div>
                    <div id="chipResetDangerZone" class="chipResetDangerZone bankerOnly">
                        <div class="chipResetDangerTitle">⚠️ Reset All Casino Chips</div>
                        <div class="chipResetDangerText">
                            Only user ID 229051 can use this. This clears all player balances, requests, free spins, transaction history and active rounds.
                        </div>
                        <input id="resetAllChipsConfirmation" type="text" placeholder='Type RESET ALL CHIPS' />
                        <button id="resetAllChipsButton" class="danger" type="button">
                            Reset All Chips
                        </button>
                    </div>

                    <div id="dailyProfitPanel" class="dailyProfitPanel bankerOnly" style="display:none;">
                        <div class="dailyProfitHeader">
                            <div>
                                <div class="panelTitle">📈 Total House Profit</div>
                                <div class="panelHint">Banker only • UTC day</div>
                            </div>
                            <button id="refreshDailyProfit" type="button">Refresh</button>
                        </div>

                        <div class="dailyProfitTotal">
                            <span>Net house profit</span>
                            <strong id="dailyProfitValue">Loading...</strong>
                        </div>

                        <div class="dailyProfitStats">
                            <div class="dailyProfitStat">
                                Total Bets
                                <strong id="dailyBetsValue">0</strong>
                            </div>
                            <div class="dailyProfitStat">
                                Payouts
                                <strong id="dailyPayoutsValue">0</strong>
                            </div>
                            <div class="dailyProfitStat">
                                Refunds
                                <strong id="dailyRefundsValue">0</strong>
                            </div>
                        </div>

                        <div id="dailyGameBreakdown" class="dailyGameBreakdown">
                            <div class="emptyState">Unlock banker controls to load today's figures.</div>
                        </div>

                        <div class="dailyProfitFootnote">
                            Profit = bets received − payouts − refunds. Resets at 00:00 UTC.
                        </div>
                    </div>
                </div>
            </div>
            <div id="casinoConfirmBackdrop" class="casinoConfirmBackdrop">
                <div class="casinoConfirmModal">
                    <div id="casinoConfirmTitle" class="casinoConfirmTitle">
                        Confirm Action
                    </div>
                    <div id="casinoConfirmText" class="casinoConfirmText">
                        Are you sure?
                    </div>
                    <div class="casinoConfirmActions">
                        <button id="casinoConfirmCancel" type="button">
                            Cancel
                        </button>
                        <button id="casinoConfirmAccept" class="danger" type="button">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            <div id="roundResultPopup" class="roundResultPopup hidden">
                <button id="roundResultClose" class="roundResultClose">×</button>
                <div class="roundResultTitle" id="roundResultTitle">Round Results</div>
                <div class="roundResultBody" id="roundResultBody"></div>
            </div>
            <div id="settings" class="panel">
                <div class="panelHeader">
                    <div class="panelTitle">⚙️ Settings</div>
                    <div class="panelHint">Local app</div>
                </div>
                <div class="small">
                    Server is set inside the file with SERVER_URL. Use your proxy URL
                    ending in /proxy.
                </div>
                <label class="small">Background Opacity</label>
                <input id="opacityInput" type="range" min="5" max="100" value="78" />
                <button id="reloadButton">Reload App</button>
            </div>

            <audio id="slotPayoutSound" preload="auto">
                <source src="./slotmachine.mp3" type="audio/mpeg">
            </audio>
            <audio id="slotBonusSound" preload="auto">
                <source src="./bonus.mp3" type="audio/mpeg">
            </audio>
            <img
                id="sessionSpinGif"
                class="sessionSpinGif"
                src="./durp.gif"
                alt=""
            />

            <div id="winOverlay">
            </div>
        </div>
        <div id="resizeHandle"></div>
    </div>
    <script>
        const SERVER_URL = "https://gambling-proxy-production.up.railway.app/proxy";
        const BANKER_IDS = ["229051", "207252", "127398", "527868", "476991"];
        const STORAGE_POSITION = "tt_shared_casino_position";
        const STORAGE_OPACITY = "tt_shared_casino_opacity";
        let state = {
            wheel: {
                bets: [],
                history: [],
                spinning: false,
                activeSpin: null
            },
            blackjack: {
                bets: [],
                players: [],
                dealerHand: [],
                status: "waiting",
                history: []
            },
            racing: {
                horses: [],
                bets: [],
                history: [],
                racing: false,
                activeRace: null
            },
            slots: {
                history: [],
                freeSpins: {},
                paytable: []
            },
            mines: {
                games: {},
                history: [],
                boardSize: 25
            },
            deal: {
                games: {},
                history: [],
                caseCount: 16
            },
            roulette: {
                bets: [],
                history: [],
                spinning: false,
                activeSpin: null,
                autoStartAt: null
            },
            chips: {
                balances: {},
                requests: []
            }
        };
        let pollInterval = null
            , failedPolls = 0
            , lastPollError = ""
            , lastSeenSpinId = ""
            , adminToken = ""
            , wheelRotation = 0
            , resultFlickerInterval = null
            , resultFlickerIndex = 0
            , autoUserId = ""
            , autoName = ""
            , minesFinishedView = null
            , minesFinishedViewUntil = 0
            , minesFinishedViewTimer = null
            , dailyProfitLoading = false
            , dailyProfitLastLoadedAt = 0
            , lastRegisteredCasinoPlayerId = ""
            , dealFinishedView = null
            , dealFinishedViewUntil = 0
            , dealFinishedViewTimer = null
            , sessionSlotSpinCount = 0
            , sessionSpinGifShown = false
            , sessionSpinGifTimer = null
            , heldSlotFreeSpinDisplay = null;
        const WHEEL_SEGMENTS = [{
            multiplier: 0,
            label: "x0",
            color: "#b72d2d"
        }, {
            multiplier: .1,
            label: "x0.1",
            color: "#d64545"
        }, {
            multiplier: .25,
            label: "x0.25",
            color: "#e06b35"
        }, {
            multiplier: .5,
            label: "x0.5",
            color: "#d9902f"
        }, {
            multiplier: .75,
            label: "x0.75",
            color: "#c9a83a"
        }, {
            multiplier: 1,
            label: "x1",
            color: "#c9c23a"
        }, {
            multiplier: 1.25,
            label: "x1.25",
            color: "#83bd3a"
        }, {
            multiplier: 1.5,
            label: "x1.5",
            color: "#4caf50"
        }, {
            multiplier: 2,
            label: "x2",
            color: "#2f8fd9"
        }, {
            multiplier: 3,
            label: "x3",
            color: "#3b66d9"
        }, {
            multiplier: 5,
            label: "x5",
            color: "#7c4dff"
        }, {
            multiplier: 10,
            label: "x10",
            color: "#ff4fd8"
        }];
        window.addEventListener("DOMContentLoaded", () => {
            const welcomeSplash =
                document.getElementById(
                    "welcomeSplash"
                );

            if (welcomeSplash) {
                setTimeout(() => {
                    welcomeSplash.classList.add(
                        "hidden"
                    );

                    setTimeout(() => {
                        welcomeSplash.remove();
                    }, 750);
                }, 5000);
            }

            const welcomeImage =
                welcomeSplash?.querySelector("img");

            if (welcomeImage) {
                welcomeImage.addEventListener(
                    "error",
                    () => {
                        console.error(
                            "Could not load ./peardise-welcome.png. " +
                            "Make sure it is in the same folder as the userapp."
                        );

                        welcomeSplash.classList.add(
                            "hidden"
                        );
                    }
                );
            }

            const bonusSound = document.getElementById(
                "slotBonusSound"
            );

            if (bonusSound) {
                bonusSound.addEventListener("error", () => {
                    console.error(
                        "Could not load ./bonus.mp3. " +
                        "Make sure it is in the same folder as the HTML file."
                    );
                });
            }

            const sessionSpinGif =
                document.getElementById(
                    "sessionSpinGif"
                );

            if (sessionSpinGif) {
                sessionSpinGif.addEventListener(
                    "error",
                    () => {
                        console.error(
                            "Could not load ./durp.gif. " +
                            "Make sure it is in the same folder as the HTML file."
                        );
                    }
                );
            }
        });

        const MULTIPLIER_ANGLES = {};
        function $(id) {
            return document.getElementById(id)
        }
        function setStatus(text, ms) {
            $("status").textContent = text;
            if (ms)
                setTimeout(() => $('status').textContent = 'Connected', ms)
        }
        function shortMoney(value) {
            const n = Number(value || 0);
            const abs = Math.abs(n);

            const formatUnit = (divisor, suffix) =>
                (n / divisor)
                    .toLocaleString(undefined, {
                        maximumFractionDigits: 2
                    }) + suffix;

            if (abs >= 1e15) return formatUnit(1e15, "Q");
            if (abs >= 1e12) return formatUnit(1e12, "T");
            if (abs >= 1e9) return formatUnit(1e9, "B");
            if (abs >= 1e6) return formatUnit(1e6, "M");
            if (abs >= 1e3) return formatUnit(1e3, "K");

            return Math.floor(n).toLocaleString();
        }
        function parseMoneyInput(value) {
            if (value == null) return 0;

            const text = String(value)
                .trim()
                .toLowerCase()
                .replace(/,/g, "");

            const match = text.match(
                /^([0-9]+(?:\.[0-9]+)?)\s*([kmbtq]?)$/
            );

            if (!match) {
                return 0;
            }

            const multipliers = {
                "": 1,
                k: 1e3,
                m: 1e6,
                b: 1e9,
                t: 1e12,
                q: 1e15
            };

            const amount =
                Number(match[1]) *
                multipliers[match[2]];

            if (
                !Number.isFinite(amount) ||
                amount < 1 ||
                !Number.isSafeInteger(Math.floor(amount))
            ) {
                return 0;
            }

            return Math.floor(amount);
        }

        function formatMoneyInput(value) {
            const amount = parseMoneyInput(value);

            if (!amount) {
                return String(value || "").trim();
            }

            return shortMoney(amount);
        }

        function enableMoneyInputs() {
            const moneyInputIds = [
                "amountInput",
                "bjAmountInput",
                "raceAmountInput",
                "slotBetInput",
                "minesBetInput",
                "dealBetInput",
                "rouletteBetInput",
                "crashBetAmount",
                "chipRequestAmount",
                "grantChipAmount",
                "cashoutAmountInput"
            ];

            for (const id of moneyInputIds) {
                const input = $(id);
                if (!input) continue;

                input.type = "text";
                input.inputMode = "decimal";
                input.autocomplete = "off";

                input.addEventListener("blur", () => {
                    if (input.value.trim()) {
                        input.value =
                            formatMoneyInput(input.value);
                    }
                });

                input.addEventListener("focus", () => {
                    const parsed =
                        parseMoneyInput(input.value);

                    if (parsed) {
                        input.value =
                            String(parsed);
                    }
                });
            }
        }

        function payoutClass(m) {
            if (m > 1)
                return 'win';
            if (m < 1)
                return 'loss';
            return 'neutral'
        }
        function escapeHtml(t) {
            return String(t || '').replace(/[&<>'"]/g, c => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[c]))
        }
        function isBanker() {
            return BANKER_IDS.includes(String(autoUserId))
        }
        function updateBankerUI() {
            const banker = isBanker();

            document
                .querySelectorAll('.bankerOnly')
                .forEach(el =>
                    el.classList.toggle('hidden', !banker)
                );

            const profitPanel = $('dailyProfitPanel');

            if (profitPanel) {
                profitPanel.style.display =
                    banker && adminToken
                        ? 'block'
                        : 'none';
            }

            const resetZone = $('chipResetDangerZone');

            if (resetZone) {
                resetZone.classList.toggle(
                    'active',
                    String(autoUserId) === '229051' &&
                    !!adminToken
                );
            }
        }

        const DegOffsetMultiplier = {
            10: 0,
            5: 30,
            3: 60,
            2: 90,
            1.5: 120,
            1.25: 150,
            1: 180,
            0.75: 210,
            0.5: 240,
            0.25: 270,
            0.1: 300,
            0: 330,
        };

        function buildWheelFace() {
            const face = $('wheelFace');
            face.innerHTML = '';
            const slice = 360 / WHEEL_SEGMENTS.length
                , divider = 'rgba(255,255,255,.95)'
                , parts = [];
            WHEEL_SEGMENTS.forEach((s, i) => {
                const start = i * slice
                    , end = start + slice
                    , center = start + slice / 2;
                MULTIPLIER_ANGLES[s.multiplier] = center;
                parts.push(`${divider} ${start}deg ${start + 1.2}deg`, `${s.color} ${start + 1.2}deg ${end - 1.2}deg`, `${divider} ${end - 1.2}deg ${end}deg`);
                const label = document.createElement('span');
                label.className = 'wheelLabel';
                label.textContent = s.label;
                const a = center - 90;
                label.style.transform = `rotate(${a}deg) translate(68px) rotate(${-a}deg) translate(-50%, -50%)`;
                face.appendChild(label)
            }
            );
            face.style.background = 'conic-gradient(' + parts.join(', ') + ')'
        }
        function getServerUrl() {
            return String(SERVER_URL || '').trim().replace(/\/$/, '')
        }
        async function apiRequest(path, options) {
            const response = await fetch(getServerUrl() + path, {
                method: options?.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options?.token ? {
                        Authorization: 'Bearer ' + options.token
                    } : {})
                },
                body: options?.body ? JSON.stringify(options.body) : undefined
            });
            const text = await response.text();
            let json;
            try {
                json = text ? JSON.parse(text) : {}
            } catch (e) {
                throw new Error(text || 'Bad server response')
            }
            if (!response.ok || json.ok === false)
                throw new Error(json.error || 'Server error');
            return json
        }
        async function refreshState(silent) {
            try {
                const requestStartedAt = Date.now();
                const json = await apiRequest('/state');
                const requestFinishedAt = Date.now();

                state = json.state || state;
                crashAuthoritativeMultiplier = 1;
                crashLastStatusAt = Date.now();
                startCrashStatusPolling();

                if (Number(json.serverTime)) {
                    const estimatedNetworkDelay =
                        (requestFinishedAt - requestStartedAt) / 2;

                    window.casinoServerClockOffset =
                        Number(json.serverTime) +
                        estimatedNetworkDelay -
                        requestFinishedAt;
                }
                failedPolls = 0;
                setStatus('Connected');
                const active = state.wheel?.activeSpin;
                if (active && active.spinId && active.spinId !== lastSeenSpinId) {
                    lastSeenSpinId = active.spinId;
                    playSpin(active)
                }
                render()
            } catch (err) {
                failedPolls++;
                lastPollError = String(err.message || err);
                if (!silent || failedPolls >= 3)
                    setStatus(lastPollError.substring(0, 28))
            }
        }
        function startPolling() {
            if (pollInterval)
                clearInterval(pollInterval);
            refreshState(false);
            pollInterval = setInterval(() => refreshState(true), 2500)
        }
        function getChipState() {
            return state.chips || { balances: {}, requests: [] };
        }

        function getMyChipBalance() {
            const balances = getChipState().balances || {};
            const entry = balances[String(autoUserId)] ?? 0;
            return Math.max(0, Math.floor(Number(typeof entry === 'object' ? entry.balance : entry) || 0));
        }

        function showCasinoConfirm({
            title = "Confirm Action",
            message = "Are you sure?",
            confirmText = "Confirm",
            cancelText = "Cancel"
        } = {}) {
            return new Promise(resolve => {
                const backdrop =
                    $("casinoConfirmBackdrop");
                const titleEl =
                    $("casinoConfirmTitle");
                const textEl =
                    $("casinoConfirmText");
                const acceptButton =
                    $("casinoConfirmAccept");
                const cancelButton =
                    $("casinoConfirmCancel");

                if (
                    !backdrop ||
                    !titleEl ||
                    !textEl ||
                    !acceptButton ||
                    !cancelButton
                ) {
                    resolve(false);
                    return;
                }

                titleEl.textContent = title;
                textEl.textContent = message;
                acceptButton.textContent = confirmText;
                cancelButton.textContent = cancelText;

                const cleanup = result => {
                    backdrop.classList.remove("active");
                    acceptButton.onclick = null;
                    cancelButton.onclick = null;
                    backdrop.onclick = null;
                    resolve(result);
                };

                acceptButton.onclick = () =>
                    cleanup(true);

                cancelButton.onclick = () =>
                    cleanup(false);

                backdrop.onclick = event => {
                    if (event.target === backdrop) {
                        cleanup(false);
                    }
                };

                backdrop.classList.add("active");
            });
        }

        async function resetAllCasinoChips() {
            if (String(autoUserId) !== "229051") {
                throw new Error(
                    "Only user ID 229051 can reset all chips"
                );
            }

            if (!adminToken) {
                throw new Error(
                    "Unlock banker controls first"
                );
            }

            const confirmation = String(
                $("resetAllChipsConfirmation")?.value || ""
            ).trim();

            if (confirmation !== "RESET ALL CHIPS") {
                throw new Error(
                    'Type "RESET ALL CHIPS" exactly'
                );
            }

            const confirmed = await showCasinoConfirm({
                title: "⚠️ Reset All Casino Chips",
                message:
                    "This permanently clears every player's chips, requests, free spins, transaction history and active casino rounds.",
                confirmText: "Yes, Reset Everything",
                cancelText: "Cancel"
            });

            if (!confirmed) {
                return;
            }

            setStatus(
                "Resetting all chips...",
                0
            );

            const json = await apiRequest(
                "/chips/reset-all",
                {
                    method: "POST",
                    token: adminToken,
                    body: {
                        requesterId: autoUserId,
                        confirmation
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error || "Reset failed"
                );
            }

            state = json.state || state;
            lastRegisteredCasinoPlayerId = "";
            $("resetAllChipsConfirmation").value = "";

            setStatus(
                `RESET DONE: ${
                    json.previousPlayerCount || 0
                } players, ${
                    shortMoney(
                        json.previousTotalChips || 0
                    )
                } chips cleared`,
                7000
            );

            render();
            await refreshState(true);
        }

        async function registerCasinoPlayer() {
            const playerId = String(
                autoUserId || ""
            ).trim();

            const playerName = String(
                autoName || ""
            ).trim();

            if (
                !playerId ||
                !playerName ||
                playerName === "Player" ||
                lastRegisteredCasinoPlayerId === playerId
            ) {
                return;
            }

            const json = await apiRequest(
                "/chips/register-player",
                {
                    method: "POST",
                    body: {
                        playerId,
                        playerName
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error ||
                    "Could not register casino player"
                );
            }

            lastRegisteredCasinoPlayerId =
                playerId;

            state =
                json.state || state;

            if (
                Number(
                    json.startingBonusGranted || 0
                ) > 0
            ) {
                setStatus(
                    `Welcome bonus: +${
                        shortMoney(
                            json.startingBonusGranted
                        )
                    } chips`,
                    5000
                );
            }

            render();
        }

        async function requestChips() {
            const playerId = String(autoUserId || '').trim();
            const playerName = String(autoName || '').trim();
            const amount = parseMoneyInput($('chipRequestAmount').value);
            if (!playerId || !playerName) return setStatus('NO GAME DATA', 1800);
            if (!amount || amount < 1) return setStatus('NO CHIP AMOUNT', 1800);
            try {
                const json = await apiRequest('/chips/request', {
                    method: 'POST',
                    body: { playerId, playerName, amount }
                });
                state = json.state || state;
                $('chipRequestAmount').value = '';
                setStatus('CHIPS REQUESTED', 1800);
                render();
            } catch (e) {
                setStatus(String(e.message || e), 2500);
            }
        }

        async function cashoutPlayerChips() {
            if (!adminToken) {
                return setStatus("BANKER LOCKED", 1800);
            }

            const playerId = String(
                $("cashoutPlayerIdInput").value || ""
            ).trim();

            const amount = parseMoneyInput($("cashoutAmountInput").value);

            if (!playerId) {
                return setStatus("NO PLAYER ID", 1800);
            }

            if (!amount || amount < 1) {
                return setStatus("NO CASH-OUT AMOUNT", 1800);
            }

            try {
                const json = await apiRequest(
                    "/chips/cashout",
                    {
                        method: "POST",
                        token: adminToken,
                        body: {
                            playerId,
                            amount
                        }
                    }
                );

                state = json.state || state;

                $("cashoutPlayerIdInput").value = "";
                $("cashoutAmountInput").value = "";

                setStatus(
                    `CASHED OUT ${shortMoney(json.amountRemoved)}`,
                    2200
                );

                render();
            } catch (error) {
                setStatus(
                    String(error.message || error),
                    2800
                );
            }
        }

        async function grantChips(playerId, amount, requestId, playerName) {
            if (!adminToken) return setStatus('LOCKED', 1500);
            const id = String(playerId || $('grantChipPlayerId').value || '').trim();
            const name = String(playerName || $('grantChipPlayerName').value || '').trim();
            const value = parseMoneyInput(amount || $('grantChipAmount').value);
            if (!id || !value || value < 1) return setStatus('PLAYER/AMOUNT NEEDED', 2000);
            try {
                const json = await apiRequest('/chips/grant', {
                    method: 'POST',
                    token: adminToken,
                    body: { playerId: id, playerName: name, amount: value, requestId: requestId || null }
                });
                state = json.state || state;
                $('grantChipPlayerId').value = '';
                $('grantChipPlayerName').value = '';
                $('grantChipAmount').value = '';
                setStatus('CHIPS GIVEN', 1800);
                render();
            } catch (e) {
                setStatus(String(e.message || e), 2500);
            }
        }

        async function rejectChipRequest(requestId) {
            if (!adminToken) return setStatus('LOCKED', 1500);
            try {
                const json = await apiRequest('/chips/reject', {
                    method: 'POST',
                    token: adminToken,
                    body: { requestId }
                });
                state = json.state || state;
                setStatus('REQUEST REJECTED', 1500);
                render();
            } catch (e) {
                setStatus(String(e.message || e), 2500);
            }
        }

        async function submitBet() {
            const playerName = String(autoName || '').trim()
                , playerId = String(autoUserId || '').trim()
                , amount = parseMoneyInput($('amountInput').value);
            if (!playerName || !playerId) {
                window.parent.postMessage({
                    type: 'getData'
                }, '*');
                return setStatus('NO GAME DATA', 2200)
            }
            if (!amount || amount < 1)
                return setStatus('NO AMOUNT', 1500);
            if (amount > getMyChipBalance())
                return setStatus('NOT ENOUGH CHIPS', 2200);
            try {
                const json = await apiRequest('/place-bet', {
                    method: 'POST',
                    body: {
                        playerId,
                        playerName,
                        amount
                    }
                });
                state = json.state || state;
                setStatus('BET SENT', 1300);
                render()
            } catch (e) {
                setStatus(String(e.message || e), 2500)
            }
        }
        function formatProfitAmount(value) {
            const amount = Math.floor(Number(value || 0));

            return Math.abs(amount).toLocaleString() + ' chips';
        }

        async function loadDailyCasinoProfit(force = false) {
            const panel = $('dailyProfitPanel');

            if (
                !panel ||
                !isBanker() ||
                !adminToken ||
                dailyProfitLoading
            ) {
                return;
            }

            if (
                !force &&
                dailyProfitLastLoadedAt &&
                Date.now() - dailyProfitLastLoadedAt < 10000
            ) {
                return;
            }

            dailyProfitLoading = true;
            panel.style.display = 'block';
            $('dailyProfitValue').textContent = 'Loading...';

            try {
                const json = await apiRequest(
                    '/chips/daily-profit',
                    {
                        token: adminToken
                    }
                );

                const stats = json.stats || {};
                const profit = Math.floor(
                    Number(stats.profit || 0)
                );

                const profitElement = $('dailyProfitValue');

                profitElement.textContent =
                    (profit >= 0 ? '+' : '-') +
                    formatProfitAmount(profit);

                profitElement.className =
                    profit > 0
                        ? 'win'
                        : profit < 0
                            ? 'loss'
                            : 'neutral';

                $('dailyBetsValue').textContent =
                    shortMoney(stats.bets || 0);

                $('dailyPayoutsValue').textContent =
                    shortMoney(stats.payouts || 0);

                $('dailyRefundsValue').textContent =
                    shortMoney(stats.refunds || 0);

                const games = Object.entries(
                    stats.games || {}
                ).sort(
                    (a, b) =>
                        Math.abs(Number(b[1]?.profit || 0)) -
                        Math.abs(Number(a[1]?.profit || 0))
                );

                $('dailyGameBreakdown').innerHTML =
                    games.length
                        ? games.map(([gameName, game]) => {
                            const gameProfit = Math.floor(
                                Number(game?.profit || 0)
                            );

                            return `
                                <div class="dailyGameRow">
                                    <span>${escapeHtml(gameName)}</span>
                                    <strong class="${
                                        gameProfit > 0
                                            ? 'win'
                                            : gameProfit < 0
                                                ? 'loss'
                                                : 'neutral'
                                    }">
                                        ${gameProfit >= 0 ? '+' : '-'}${formatProfitAmount(gameProfit)}
                                    </strong>
                                </div>
                            `;
                        }).join('')
                        : '<div class="emptyState">No tracked games have been played today.</div>';

                dailyProfitLastLoadedAt = Date.now();
            } catch (error) {
                $('dailyProfitValue').textContent =
                    'Could not load';

                $('dailyProfitValue').className = 'loss';

                $('dailyGameBreakdown').innerHTML = `
                    <div class="emptyState">
                        ${escapeHtml(String(error.message || error))}
                    </div>
                `;
            } finally {
                dailyProfitLoading = false;
            }
        }

        async function loginAdmin() {
            const pin = String(
                $('adminPinInput').value || ''
            ).trim();

            if (!pin) {
                return setStatus('NO PIN', 1500);
            }

            try {
                const json = await apiRequest(
                    '/admin-login',
                    {
                        method: 'POST',
                        body: { pin }
                    }
                );

                adminToken = json.token || '';

                if (!adminToken) {
                    throw new Error(
                        'Backend returned no banker token'
                    );
                }

                setStatus('BANKER ON', 1800);
                updateBankerUI();
                render();
                loadDailyCasinoProfit(true);
            } catch (error) {
                const message = String(
                    error?.message || error || 'Login failed'
                );

                console.error(
                    'Banker login failed:',
                    message
                );

                setStatus(
                    message.substring(0, 28),
                    2800
                );
            }
        }
        async function adminAction(name) {
            if (!adminToken)
                return setStatus('LOCKED', 1500);
            const map = {
                confirmAll: '/confirm-all',
                spin: '/spin',
                clearRound: '/clear-round',
                bjConfirm: '/blackjack/confirm-all',
                bjStart: '/blackjack/start',
                bjReset: '/blackjack/reset',
                raceConfirm: '/racing/confirm-all',
                raceStart: '/racing/start',
                raceClear: '/racing/clear'
            };
            try {
                const json = await apiRequest(map[name], {
                    method: 'POST',
                    token: adminToken,
                    body: {
                        token: adminToken
                    }
                });
                if (json.spin && json.spin.spinId && json.spin.spinId !== lastSeenSpinId) {
                    lastSeenSpinId = json.spin.spinId;
                    playSpin(json.spin)
                }
                state = json.state || state;
                render()
            } catch (e) {
                setStatus(String(e.message || e), 2500)
            }
        }
        function stopResultFlicker(final) {
            if (resultFlickerInterval)
                clearInterval(resultFlickerInterval);
            resultFlickerInterval = null;
            const inner = $('wheelInner');
            inner.classList.remove('flickering');
            if (final !== undefined && final !== null)
                inner.textContent = 'x' + final
        }
        function startResultFlicker() {
            stopResultFlicker();
            const inner = $('wheelInner');
            inner.classList.add('flickering');
            resultFlickerIndex = 0;
            resultFlickerInterval = setInterval(() => {
                inner.textContent = WHEEL_SEGMENTS[resultFlickerIndex++ % WHEEL_SEGMENTS.length].label
            }
                , 65)
        }

        function playSpin(spin) {
            if (!spin) return;

            const results = Array.isArray(spin.results) ? spin.results : [];
            const myResult = results.find(r => String(r.playerId) === String(autoUserId));
            const firstResult = results[0] || {};

            const displayResult = myResult || firstResult;
            const m = Number(displayResult.multiplier ?? 1);

            let targetAngle = Number(DegOffsetMultiplier[m] ?? MULTIPLIER_ANGLES[m] ?? 0);
            targetAngle += 15;

            startResultFlicker();

            const currentAngle = ((wheelRotation % 360) + 360) % 360;
            let difference = targetAngle - currentAngle;
            if (difference < 0) difference += 360;

            wheelRotation += 1440 + difference;

            $('wheelFace').style.transform = 'rotate(' + wheelRotation + 'deg)';
            $('resultText').textContent = 'Spinning...';
            $('resultText').className = 'bigResult neutral';
            $('resultSub').textContent = 'Every bet is rolling its own multiplier...';

            setTimeout(() => {
                stopResultFlicker(m);
                $('resultText').textContent = myResult ? 'Your result: x' + m : 'Results locked';
                $('resultText').className = 'bigResult ' + payoutClass(m);
                $('resultSub').textContent = myResult
                    ? 'Your payout: ' + shortMoney(myResult.payout) + ' (' + (myResult.profit >= 0 ? '+' : '') + shortMoney(myResult.profit) + ')'
                    : 'Everyone can see each player’s multiplier below.';
            }, 4200);
        }

        async function bjSubmitBet() {
            const playerName = String(autoName || '').trim()
                , playerId = String(autoUserId || '').trim()
                , amount = parseMoneyInput($('bjAmountInput').value);
            if (!playerName || !playerId) {
                window.parent.postMessage({
                    type: 'getData'
                }, '*');
                return setStatus('NO GAME DATA', 2200)
            }
            if (!amount || amount < 1)
                return setStatus('NO AMOUNT', 1500);
            if (amount > getMyChipBalance())
                return setStatus('NOT ENOUGH CHIPS', 2200);
            try {
                const json = await apiRequest('/blackjack/place-bet', {
                    method: 'POST',
                    body: {
                        playerId,
                        playerName,
                        amount
                    }
                });
                state = json.state || state;
                setStatus('BJ BET SENT', 1300);
                render()
            } catch (e) {
                setStatus(String(e.message || e), 2500)
            }
        }
        async function bjPlayerAction(action) {
            try {
                const json = await apiRequest('/blackjack/' + action, {
                    method: 'POST',
                    body: {
                        playerId: autoUserId
                    }
                });
                state = json.state || state;
                render()
            } catch (e) {
                setStatus(String(e.message || e), 2200)
            }
        }

        async function raceSubmitBet() {
            const playerName = String(autoName || '').trim()
                , playerId = String(autoUserId || '').trim()
                , amount = parseMoneyInput($('raceAmountInput').value)
                , horseId = String($('raceHorseSelect').value || '');
            if (!playerName || !playerId) {
                window.parent.postMessage({
                    type: 'getData'
                }, '*');
                return setStatus('NO GAME DATA', 2200)
            }
            if (!horseId)
                return setStatus('NO HORSE', 1500);
            if (!amount || amount < 1)
                return setStatus('NO AMOUNT', 1500);
            if (amount > getMyChipBalance())
                return setStatus('NOT ENOUGH CHIPS', 2200);
            try {
                const json = await apiRequest('/racing/place-bet', {
                    method: 'POST',
                    body: {
                        playerId,
                        playerName,
                        amount,
                        horseId
                    }
                });
                state = json.state || state;
                setStatus('RACE BET SENT', 1300);
                render()
            } catch (e) {
                setStatus(String(e.message || e), 2500)
            }
        }
        function buildRaceHorseSelect() {
            const sel = $('raceHorseSelect');
            if (!sel)
                return;
            const horses = (state.racing && state.racing.horses) || [];
            const current = sel.value;
            sel.innerHTML = '<option value="">Choose a horse...</option>' + horses.map(h => `<option value="${escapeHtml(h.id)}">${escapeHtml(h.name)}</option>`).join('');
            if (current && horses.some(h => h.id === current))
                sel.value = current
        }
        let currentRaceTrackKey = '';
        let localRace = null;
        let localRaceFrame = 0;
        let lastLocalRaceId = '';

        function normaliseRacePlacements(raceData, horses) {
            const winnerId = String(raceData?.winnerHorseId || raceData?.winnerId || '');
            let placements = Array.isArray(raceData?.placements) ? raceData.placements.slice() : [];

            if (!placements.length && winnerId) {
                placements = horses.map((h, i) => ({
                    id: h.id,
                    place: String(h.id) === winnerId ? 1 : i + 2
                }));
            }

            placements.sort((a, b) => Number(a.place || 99) - Number(b.place || 99));

            const used = new Set();
            const fixed = [];
            placements.forEach((p, i) => {
                const id = String(p.id || p.horseId || '');
                if (!id || used.has(id)) return;
                used.add(id);
                fixed.push({ id, place: Number(p.place || (i + 1)) });
            });

            horses.forEach(h => {
                if (!used.has(String(h.id))) {
                    fixed.push({ id: String(h.id), place: fixed.length + 1 });
                }
            });

            if (winnerId) {
                fixed.forEach(p => {
                    if (String(p.id) === winnerId) p.place = 1;
                });
                fixed.sort((a, b) => Number(a.place || 99) - Number(b.place || 99));
                fixed.forEach((p, i) => p.place = i + 1);
            }

            return fixed;
        }

        function ensureRaceTrack(horses, raceId) {
            const key = horses.map(h => h.id).join('|') + '|' + raceId;

            if (currentRaceTrackKey !== key) {
                currentRaceTrackKey = key;

                $('raceTrack').innerHTML = horses.map((h, index) => `
            <div class="horseLane" id="horseLane_${escapeHtml(h.id)}">
                <span class="horseDot" id="horseDot_${escapeHtml(h.id)}">🐎</span>
                <span class="horseName">${index + 1}. ${escapeHtml(h.name)}</span>
            </div>
        `).join('');
            }
        }

        function setHorsePositions(horses, placements, progress, winnerId, racing) {
            const elapsed = localRace ? Date.now() - localRace.startedAt : 0;

            horses.forEach((h, index) => {
                const dot = $('horseDot_' + h.id);
                const lane = $('horseLane_' + h.id);

                if (!dot || !lane) return;

                const placement =
                    placements.find(p => String(p.id) === String(h.id)) ||
                    { place: horses.length };

                const place = Number(placement.place || horses.length);

                const finishPct = Math.max(60, 91 - (place - 1) * 5.5);

                const surge =
                    Math.sin((progress * Math.PI * 4.5) + (index * 1.65)) *
                    (1 - progress) *
                    8;

                const gallop =
                    Math.sin((elapsed / 90) + (index * 2.2)) *
                    (racing ? 2.2 : 0);

                let pct =
                    4 +
                    (finishPct - 4) *
                    Math.pow(progress, 0.78) +
                    surge +
                    gallop;

                if (progress > 0.84) {
                    const lockIn = (progress - 0.84) / 0.16;
                    pct = pct * (1 - lockIn) + finishPct * lockIn;
                }

                pct = Math.max(4, Math.min(92, pct));

                dot.style.left = pct + '%';
                dot.classList.toggle('racing', !!racing);
                lane.classList.toggle(
                    'winner',
                    !racing && String(h.id) === String(winnerId)
                );
            });
        }

        function startLocalRace(raceData, horses) {
            if (!raceData || !horses.length) return;
            const raceId = String(raceData.raceId || raceData.id || Date.now());
            if (lastLocalRaceId === raceId) return;

            if (localRaceFrame) cancelAnimationFrame(localRaceFrame);

            const placements = normaliseRacePlacements(raceData, horses);
            const winnerId = String(raceData.winnerHorseId || raceData.winnerId || (placements[0] && placements[0].id) || '');
            localRace = {
                raceId,
                winnerId,
                placements,
                startedAt: Date.now(),
                duration: Number(raceData.durationMs || 7200)
            };
            lastLocalRaceId = raceId;
            ensureRaceTrack(horses, raceId);

            const tick = () => {
                if (!localRace || localRace.raceId !== raceId) return;
                const elapsed = Date.now() - localRace.startedAt;
                const progress = Math.min(1, elapsed / localRace.duration);
                setHorsePositions(horses, placements, progress, winnerId, progress < 1);

                if (progress < 1) {
                    localRaceFrame = requestAnimationFrame(tick);
                } else {
                    localRaceFrame = 0;
                    localRace = null;
                }
            };
            tick();
        }

        function renderRaceTrack(race) {
            const horses = (state.racing && state.racing.horses) || [];
            const active = race && race.activeRace;
            const last = race && race.history && race.history[0];
            if (!horses.length) {
                currentRaceTrackKey = '';
                $('raceTrack').innerHTML = '<div class="emptyState">Waiting for horses from server.</div>';
                return;
            }

            const raceData = active || last;
            const raceId = raceData ? String(raceData.raceId || raceData.id || 'last') : 'idle';
            ensureRaceTrack(horses, raceId);

            if (raceData && raceId !== lastLocalRaceId) {
                startLocalRace(raceData, horses);
                return;
            }

            if (localRace) return;

            if (raceData) {
                const placements = normaliseRacePlacements(raceData, horses);
                const winnerId = String(raceData.winnerHorseId || raceData.winnerId || (placements[0] && placements[0].id) || '');
                setHorsePositions(horses, placements, 1, winnerId, false);
            } else {
                horses.forEach(h => {
                    const dot = $('horseDot_' + h.id);
                    const lane = $('horseLane_' + h.id);
                    if (dot) {
                        dot.style.left = '4%';
                        dot.classList.remove('racing');
                    }
                    if (lane) lane.classList.remove('winner');
                });
            }
        }


        const SLOT_SYMBOLS = {
            pear: "🍐", seven: "7️⃣", bell: "🔔", gem: "💎",
            crown: "👑", cherry: "🍒", wild: "🃏", scatter: "🐉"
        };
        let slotAnimating = false;

        function buildSlotGrid(grid) {
            const values = Array.isArray(grid) && grid.length === 3
                ? grid
                : Array.from({ length: 3 }, () => Array(5).fill('pear'));
            $('slotGrid').innerHTML = values.flatMap((row, r) => row.map((symbol, c) =>
                `<div class="slotCell" data-row="${r}" data-col="${c}">${SLOT_SYMBOLS[symbol] || symbol}</div>`
            )).join('');
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function markLockedScatterCells(lockedScatters, dropping) {
            document.querySelectorAll('.slotCell').forEach(cell => {
                cell.classList.remove(
                    'scatterLocked',
                    'scatterDropping'
                );
            });
            (lockedScatters || []).forEach(scatter => {
                const cell = document.querySelector(
                    `.slotCell[data-row="${scatter.row}"][data-col="${scatter.col}"]`
                );
                if (!cell) return;
                cell.classList.add('scatterLocked');
                if (dropping) {
                    cell.classList.add('scatterDropping');
                }
            });
        }
        async function animateScatterNudge(result) {
            const steps = Array.isArray(
                result.scatterNudgeSteps
            )
                ? result.scatterNudgeSteps
                : [];
            if (!result.scatterNudgeTriggered || !steps.length) {
                buildSlotGrid(result.grid);
                return;
            }
            buildSlotGrid(result.initialGrid || result.grid);
            const initialScatters = [];
            (result.initialGrid || []).forEach((row, rowIndex) => {
                row.forEach((symbol, colIndex) => {
                    if (symbol === 'scatter') {
                        initialScatters.push({
                            row: rowIndex,
                            col: colIndex
                        });
                    }
                });
            });
            markLockedScatterCells(initialScatters, false);
            $('slotResultText').textContent = 'Scatter nudge!';
            $('slotResultText').className = 'bigResult neutral';
            $('slotResultSub').textContent =
                'Two scatter reels are locked. Other reels respin for free.';
            await wait(700);
            for (const step of steps) {
                $('slotGrid').classList.add('spinning');
                // Keep locked reels visible while the other reels spin.
                const fakeTimer = setInterval(() => {
                    const fakeGrid = step.grid.map(row => [...row]);
                    const lockedColumns = new Set(
                        step.lockedColumns || []
                    );
                    for (let col = 0; col < 5; col++) {
                        if (lockedColumns.has(col)) continue;
                        for (let row = 0; row < 3; row++) {
                            const keys = Object.keys(SLOT_SYMBOLS);
                            fakeGrid[row][col] =
                                keys[Math.floor(Math.random() * keys.length)];
                        }
                    }
                    buildSlotGrid(fakeGrid);
                    markLockedScatterCells(
                        step.lockedScatters,
                        false
                    );
                }, 90);
                $('slotResultSub').textContent =
                    `Free scatter respin ${step.attempt}...`;
                await wait(850);
                clearInterval(fakeTimer);
                $('slotGrid').classList.remove('spinning');
                buildSlotGrid(step.grid);
                markLockedScatterCells(
                    step.lockedScatters,
                    true
                );
                await wait(650);
                if (step.success) {
                    $('slotResultText').textContent =
                        'Third scatter landed!';
                    $('slotResultText').className =
                        'bigResult win';
                    $('slotResultSub').textContent =
                        'Free spins triggered.';
                    await wait(700);
                    break;
                }
            }
            document.querySelectorAll('.slotCell').forEach(cell => {
                cell.classList.remove(
                    'scatterLocked',
                    'scatterDropping'
                );
            });
        }


        function renderSlotPaytable() {
            const fallback = [
                ['pear', '🍐', 3, 0.5, 4, 1.5, 5, 5], ['cherry', '🍒', 3, 0.8, 4, 2.5, 5, 8],
                ['bell', '🔔', 3, 1, 4, 4, 5, 12], ['gem', '💎', 3, 1.5, 4, 6, 5, 20],
                ['crown', '👑', 3, 2, 4, 10, 5, 40], ['seven', '7️⃣', 3, 3, 4, 15, 5, 75],
                ['wild', '🃏', 3, 4, 4, 20, 5, 100], ['scatter', '⭐', 3, 2, 4, 8, 5, 30]
            ];
            const items = (state.slots?.paytable?.length ? state.slots.paytable : fallback.map(x => ({ symbol: x[0], label: x[1], pays: { 3: x[3], 4: x[5], 5: x[7] } })));
            $('slotPaytable').innerHTML = items.map(item =>
                `<div class="slotPayItem">${escapeHtml(item.label || SLOT_SYMBOLS[item.symbol] || item.symbol)} ${escapeHtml(item.symbol)}<b>3× ${item.pays?.[3] || 0} • 4× ${item.pays?.[4] || 0} • 5× ${item.pays?.[5] || 0}</b></div>`
            ).join('');
        }

        let freeSpinUnlockPopupTimer = null;

        function playSlotBonusSound() {
            const bonusSound = $("slotBonusSound");

            if (!bonusSound) {
                console.error(
                    "Bonus sound element #slotBonusSound was not found"
                );
                return;
            }

            bonusSound.pause();
            bonusSound.currentTime = 0;
            bonusSound.volume = 0.6;
            bonusSound.load();

            const playPromise = bonusSound.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(error => {
                    console.error(
                        "Bonus sound failed to play:",
                        error
                    );
                });
            }
        }

        function showFreeSpinUnlockPopup(amount) {
            const awarded = Math.max(
                0,
                Math.floor(Number(amount || 0))
            );

            if (!awarded) return;

            // Play once whenever free spins are newly awarded.
            playSlotBonusSound();

            document
                .querySelectorAll(".freeSpinUnlockPopup")
                .forEach(element => element.remove());

            if (freeSpinUnlockPopupTimer) {
                clearTimeout(freeSpinUnlockPopupTimer);
                freeSpinUnlockPopupTimer = null;
            }

            const popup = document.createElement("div");
            popup.className = "freeSpinUnlockPopup";
            popup.innerHTML = `
                <div class="freeSpinUnlockDragon">🐉</div>
                <div class="freeSpinUnlockTitle">
                    FREE SPINS UNLOCKED
                </div>
                <div class="freeSpinUnlockAmount">
                    ${awarded} FREE SPIN${awarded === 1 ? "" : "S"}
                </div>
            `;

            document.body.appendChild(popup);

            freeSpinUnlockPopupTimer = setTimeout(() => {
                popup.remove();
                freeSpinUnlockPopupTimer = null;
            }, 3700);
        }

        function getDisplayedSlotFreeSpins() {
            if (
                slotAnimating &&
                heldSlotFreeSpinDisplay !== null
            ) {
                return Math.max(
                    0,
                    Math.floor(
                        Number(
                            heldSlotFreeSpinDisplay || 0
                        )
                    )
                );
            }

            return Math.max(
                0,
                Math.floor(
                    Number(
                        state.slots?.freeSpins?.[
                            String(autoUserId)
                        ] || 0
                    )
                )
            );
        }

        function updateFreeSpinDisplay() {
            const freeSpins =
                getDisplayedSlotFreeSpins();

            const banner = $("freeSpinBanner");
            const amountText = $("freeSpinBannerAmount");
            const spinButton = $("slotSpinButton");
            const slotMachine = $("slotMachineCard");

            if (banner) {
                banner.classList.toggle(
                    "active",
                    freeSpins > 0
                );
            }

            if (amountText) {
                amountText.textContent =
                    `${freeSpins} FREE SPIN${
                        freeSpins === 1 ? "" : "S"
                    } AVAILABLE`;
            }

            if (spinButton) {
                spinButton.textContent =
                    freeSpins > 0
                        ? `Use Free Spin (${freeSpins})`
                        : "Spin Reels";

                spinButton.classList.toggle(
                    "freeSpinReady",
                    freeSpins > 0
                );
            }

            if (slotMachine) {
                slotMachine.classList.toggle(
                    "freeSpinActive",
                    freeSpins > 0
                );
            }
        }

        function showSessionSpinGif() {
            if (sessionSpinGifShown) return;

            const gif = $("sessionSpinGif");

            if (!gif) {
                console.error(
                    "Could not find #sessionSpinGif"
                );
                return;
            }

            sessionSpinGifShown = true;

            if (sessionSpinGifTimer) {
                clearTimeout(sessionSpinGifTimer);
            }

            gif.classList.remove("active");

            // Restart the GIF and its five-second animation.
            gif.src = "";
            void gif.offsetWidth;
            gif.src = "./durp.gif";
            gif.classList.add("active");

            sessionSpinGifTimer = setTimeout(() => {
                gif.classList.remove("active");
                sessionSpinGifTimer = null;
            }, 5000);
        }

        function recordSessionSlotSpin() {
            sessionSlotSpinCount += 1;

            if (
                sessionSlotSpinCount >= 100 &&
                !sessionSpinGifShown
            ) {
                showSessionSpinGif();
            }
        }

        async function slotSpin() {
            if (slotAnimating) return;

            const playerId = String(autoUserId || '').trim();
            const playerName = String(autoName || '').trim();
            const amount =
                parseMoneyInput($('slotBetInput').value);

            const freeSpins = Number(
                state.slots?.freeSpins?.[playerId] || 0
            );

            if (!playerId || !playerName) {
                return setStatus('NO GAME DATA', 1800);
            }

            if (!freeSpins && (!amount || amount < 1)) {
                return setStatus('NO SLOT BET', 1800);
            }

            if (!freeSpins && amount > getMyChipBalance()) {
                return setStatus('NOT ENOUGH CHIPS', 2200);
            }

            heldSlotFreeSpinDisplay =
                Math.max(
                    0,
                    Math.floor(
                        Number(freeSpins || 0)
                    )
                );

            slotAnimating = true;
            $('slotSpinButton').disabled = true;
            $('slotGrid').classList.add('spinning');

            const fakeTimer = setInterval(() => {
                const fake = Array.from(
                    { length: 3 },
                    () =>
                        Array.from(
                            { length: 5 },
                            () => {
                                const keys =
                                    Object.keys(SLOT_SYMBOLS);

                                return keys[
                                    Math.floor(
                                        Math.random() *
                                        keys.length
                                    )
                                ];
                            }
                        )
                );

                buildSlotGrid(fake);
            }, 90);

            try {
                const json = await apiRequest('/slots/spin', {
                    method: 'POST',
                    body: {
                        playerId,
                        playerName,
                        amount
                    }
                });

                state = json.state || state;
                recordSessionSlotSpin();

                await wait(1500);

                clearInterval(fakeTimer);
                $('slotGrid').classList.remove('spinning');

                await animateScatterNudge(json.result);

                buildSlotGrid(json.result.grid);

                (json.result.winningCells || []).forEach(cell => {
                    const element = document.querySelector(
                        `.slotCell[data-row="${cell.row}"][data-col="${cell.col}"]`
                    );

                    if (element) {
                        element.classList.add('winLine');
                    }
                });

                $('slotResultText').textContent =
                    json.result.payout > 0
                        ? `Won ${shortMoney(json.result.payout)} chips!`
                        : json.result.scatterNudgeTriggered
                            ? 'Scatter nudge finished'
                            : 'No win';

                $('slotResultText').className =
                    'bigResult ' +
                    (
                        json.result.payout > 0
                            ? 'win'
                            : json.result.scatterNudgeTriggered
                                ? 'neutral'
                                : 'loss'
                    );

                $('slotResultSub').textContent =
                    json.result.message || 'Spin complete';

                // Leave the final symbols and winning lines visible briefly
                // before showing any payout or jackpot overlays.
                await wait(650);

                // The server state already contains the awarded free spins,
                // but keep them hidden until the reels have fully settled.
                heldSlotFreeSpinDisplay = null;
                slotAnimating = false;

                render();

                // Let render finish updating the balance/free-spin counters
                // before displaying the result effects.
                await wait(100);

                if (json.result.payout > 0) {
                    playSlotPayoutSound();
                    showWinEffect();
                } else if (
                    json.result.freeSpinsAwarded > 0
                ) {
                    showWinEffect();
                }

                if (
                    Number(
                        json.result.freeSpinsAwarded || 0
                    ) > 0
                ) {
                    showFreeSpinUnlockPopup(
                        json.result.freeSpinsAwarded
                    );
                }
            } catch (error) {
                clearInterval(fakeTimer);
                $('slotGrid').classList.remove('spinning');

                setStatus(
                    String(error.message || error),
                    2500
                );
            } finally {
                heldSlotFreeSpinDisplay = null;
                slotAnimating = false;
                $('slotSpinButton').disabled = false;
            }
        }


        function getMyMinesGame() {
            return (
                state.mines?.games?.[
                String(autoUserId)
                ] || null
            );
        }

        function buildMinesBoard(
            game,
            revealedMines = []
        ) {
            const board = $('minesBoard');

            if (!board) return;

            const revealed = new Set(
                (game?.revealed || []).map(Number)
            );

            const mines = new Set(
                (revealedMines || []).map(Number)
            );

            const gameActive = !!game;
            const finished = game?.finished === true;

            board.innerHTML = Array.from(
                { length: 25 },
                (_, cell) => {
                    const isSafe =
                        revealed.has(cell);

                    const isMine =
                        mines.has(cell);

                    const classes = [
                        'mineTile',
                        isSafe ? 'safe' : '',
                        isMine ? 'mine' : ''
                    ].filter(Boolean).join(' ');

                    const label = isMine
                        ? '💣'
                        : isSafe
                            ? '💎'
                            : '💠';

                    return `
                          <button
                            class="${classes}"
                            data-mine-cell="${cell}"
                            ${!gameActive || finished || isSafe || isMine ? 'disabled' : ''}
                          >${label}</button>
                        `;
                }
            ).join('');

            board
                .querySelectorAll(
                    '[data-mine-cell]:not(:disabled)'
                )
                .forEach(button => {
                    button.addEventListener(
                        'click',
                        () =>
                            revealMineTile(
                                Number(
                                    button.dataset.mineCell
                                )
                            )
                    );
                });
        }

        async function startMinesGame() {
            minesFinishedView = null;
            minesFinishedViewUntil = 0;

            render();

            const playerId =
                String(autoUserId || '').trim();

            const playerName =
                String(autoName || '').trim();

            const amount = Math.floor(
                Number(
                    $('minesBetInput').value || 0
                )
            );

            const mineCount = Math.floor(
                Number(
                    $('minesCountInput').value || 0
                )
            );

            if (!playerId || !playerName) {
                return setStatus(
                    'NO GAME DATA',
                    1800
                );
            }

            if (!amount || amount < 1) {
                return setStatus(
                    'NO MINES BET',
                    1800
                );
            }

            if (amount > getMyChipBalance()) {
                return setStatus(
                    'NOT ENOUGH CHIPS',
                    2200
                );
            }

            if (
                mineCount <= 0 ||
                mineCount >= 25
            ) {
                return setStatus(
                    'CHOOSE 1-24 MINES',
                    2000
                );
            }

            try {
                const json = await apiRequest(
                    '/mines/start',
                    {
                        method: 'POST',
                        body: {
                            playerId,
                            playerName,
                            amount,
                            mineCount
                        }
                    }
                );

                state = json.state || state;
                console.log(state)
                setStatus('MINES STARTED', 1500);
                render();
            } catch (error) {
                setStatus(
                    String(error.message || error),
                    2500
                );
            }
        }

        function showFinishedMinesBoard({
            minePositions = [],
            revealed = [],
            statusText = '',
            safeReveals = 0,
            multiplier = 0,
            payout = 0,
            durationMs = 8000
        }) {
            if (minesFinishedViewTimer) {
                clearTimeout(minesFinishedViewTimer);
            }

            minesFinishedView = {
                minePositions: [...minePositions],
                revealed: [...revealed],
                statusText,
                safeReveals,
                multiplier,
                payout
            };

            minesFinishedViewUntil =
                Date.now() + durationMs;

            buildMinesBoard(
                {
                    revealed: minesFinishedView.revealed,
                    finished: true
                },
                minesFinishedView.minePositions
            );

            $('minesStatusText').textContent =
                statusText;

            $('minesSafeCount').textContent =
                String(safeReveals || 0);

            $('minesMultiplier').textContent =
                `x${Number(multiplier || 0).toFixed(2)}`;

            $('minesPotentialPayout').textContent =
                shortMoney(payout || 0);

            $('minesStartButton').disabled = false;
            $('minesCashoutButton').disabled = false;
            $('minesBetInput').disabled = false;
            $('minesCountInput').disabled = false;

            minesFinishedViewUntil = Infinity;
            minesFinishedViewTimer = null;
        }

        async function revealMineTile(cell) {
            const playerId =
                String(autoUserId || '').trim();

            if (!playerId) {
                return setStatus(
                    'NO GAME DATA',
                    1800
                );
            }

            const buttons =
                document.querySelectorAll(
                    '.mineTile'
                );

            buttons.forEach(
                button =>
                    (button.disabled = true)
            );

            try {
                const json = await apiRequest(
                    '/mines/reveal',
                    {
                        method: 'POST',
                        body: {
                            playerId,
                            cell
                        }
                    }
                );

                state = json.state || state;

                if (json.hitMine) {
                    showFinishedMinesBoard({
                        minePositions:
                            json.minePositions || [],
                        revealed:
                            json.revealed || json.history?.revealed || [],
                        statusText:
                            'Mine hit — bet lost',
                        safeReveals:
                            json.history?.safeReveals || 0,
                        multiplier: 0,
                        payout: 0,
                        durationMs: 8000
                    });

                    setStatus(
                        'BOOM! MINE HIT',
                        2200
                    );

                    return;
                }

                if (json.cleared) {
                    showFinishedMinesBoard({
                        minePositions:
                            json.minePositions || [],
                        revealed:
                            json.revealed || [],
                        statusText:
                            `Board cleared — won ${shortMoney(
                                json.history?.payout || 0
                            )} chips`,
                        safeReveals:
                            json.history?.safeReveals || 0,
                        multiplier:
                            json.history?.multiplier || 0,
                        payout:
                            json.history?.payout || 0,
                        durationMs: 8000
                    });

                    setStatus(
                        'BOARD CLEARED',
                        2200
                    );

                    playSlotPayoutSound();
                    showWinEffect();
                    return;
                }

                render();
            } catch (error) {
                setStatus(
                    String(error.message || error),
                    2500
                );

                render();
            }
        }

        async function cashoutMines() {
            const playerId =
                String(autoUserId || '').trim();

            if (!playerId) {
                return setStatus(
                    'NO GAME DATA',
                    1800
                );
            }

            try {
                const json = await apiRequest(
                    '/mines/cashout',
                    {
                        method: 'POST',
                        body: {
                            playerId
                        }
                    }
                );

                state = json.state || state;

                showFinishedMinesBoard({
                    minePositions:
                        json.minePositions || [],
                    revealed:
                        json.history?.revealed || [],
                    statusText:
                        `Cashed out ${shortMoney(
                            json.payout
                        )} chips`,
                    safeReveals:
                        json.history?.safeReveals || 0,
                    multiplier:
                        json.multiplier || 1,
                    payout:
                        json.payout || 0,
                    durationMs: 8000
                });

                setStatus(
                    `CASHED OUT X${Number(
                        json.multiplier || 1
                    ).toFixed(2)}`,
                    2200
                );

                playSlotPayoutSound();
                showWinEffect();
            } catch (error) {
                setStatus(
                    String(error.message || error),
                    2500
                );
            }
        }

        const DEAL_PRIZE_MULTIPLIERS = [
            0, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60,
            0.75, 0.90, 1, 1.20, 1.50, 2, 2.50, 3.20
        ];

        let selectedDealCase = null;

        const ROULETTE_RED_NUMBERS =
            new Set([
                1, 3, 5, 7, 9, 12, 14, 16, 18,
                19, 21, 23, 25, 27, 30, 32, 34, 36
            ]);

        let selectedRouletteBet = {
            betType: "",
            selection: ""
        };

        let rouletteVisualSpinId = "";
        let rouletteWheelRotation = 0;

        function rouletteBetLabel(bet) {
            const labels = {
                red: "Red",
                black: "Black",
                odd: "Odd",
                even: "Even",
                low: "1–18",
                high: "19–36",
                dozen1: "1st 12",
                dozen2: "2nd 12",
                dozen3: "3rd 12",
                column1: "Column 1",
                column2: "Column 2",
                column3: "Column 3"
            };

            if (bet.betType === "straight") {
                return `Number ${bet.selection}`;
            }

            return labels[bet.betType] || bet.betType;
        }

        function buildRouletteBoard() {
            const grid = $("rouletteNumberGrid");

            if (!grid || grid.dataset.built) {
                return;
            }

            const buttons = [];

            for (let number = 0; number <= 36; number++) {
                const color =
                    number === 0
                        ? "green"
                        : ROULETTE_RED_NUMBERS.has(number)
                            ? "red"
                            : "";

                buttons.push(`
                    <button
                        class="rouletteBetButton ${color}"
                        data-bet-type="straight"
                        data-selection="${number}"
                    >
                        ${number}
                    </button>
                `);
            }

            grid.innerHTML = buttons.join("");
            grid.dataset.built = "1";

            document
                .querySelectorAll(
                    ".rouletteBetButton[data-bet-type]"
                )
                .forEach(button => {
                    button.addEventListener(
                        "click",
                        () => {
                            selectedRouletteBet = {
                                betType:
                                    button.dataset.betType,
                                selection:
                                    button.dataset.selection ??
                                    button.dataset.betType
                            };

                            document
                                .querySelectorAll(
                                    ".rouletteBetButton"
                                )
                                .forEach(item =>
                                    item.classList.remove(
                                        "selected"
                                    )
                                );

                            button.classList.add(
                                "selected"
                            );
                        }
                    );
                });
        }

        function rouletteBetKey(betType, selection) {
            return `${String(betType)}:${String(
                selection ?? betType
            )}`;
        }

        function applyRouletteChipMarkers(myBets) {
            const totals = new Map();

            for (const bet of myBets || []) {
                const key = rouletteBetKey(
                    bet.betType,
                    bet.betType === "straight"
                        ? Number(bet.selection)
                        : bet.betType
                );

                totals.set(
                    key,
                    (totals.get(key) || 0) +
                    Number(bet.amount || 0)
                );
            }

            document
                .querySelectorAll(
                    ".rouletteBetButton[data-bet-type]"
                )
                .forEach(button => {
                    button
                        .querySelectorAll(
                            ".rouletteChipMarker"
                        )
                        .forEach(marker =>
                            marker.remove()
                        );

                    button.classList.remove(
                        "hasPlayerBet"
                    );

                    const betType =
                        button.dataset.betType;

                    const selection =
                        betType === "straight"
                            ? Number(
                                button.dataset.selection
                            )
                            : betType;

                    const total = totals.get(
                        rouletteBetKey(
                            betType,
                            selection
                        )
                    ) || 0;

                    if (total <= 0) {
                        return;
                    }

                    const marker =
                        document.createElement("span");

                    marker.className =
                        "rouletteChipMarker";

                    marker.textContent =
                        shortMoney(total);

                    marker.title =
                        `${shortMoney(total)} chips bet`;

                    button.appendChild(marker);
                    button.classList.add(
                        "hasPlayerBet"
                    );
                });
        }

        function renderRoulette() {
            const roulettePage =
                $("roulettePage");

            if (!roulettePage) {
                return;
            }

            buildRouletteBoard();

            const roulette =
                state.roulette || {
                    bets: [],
                    history: [],
                    spinning: false,
                    activeSpin: null,
                    autoStartAt: null
                };

            const myBets =
                (roulette.bets || []).filter(
                    bet =>
                        String(bet.playerId) ===
                        String(autoUserId)
                );

            applyRouletteChipMarkers(myBets);

            const totalRoundStake =
                myBets.reduce(
                    (sum, bet) =>
                        sum + Number(
                            bet.amount || 0
                        ),
                    0
                );

            if ($("rouletteRoundStakeSummary")) {
                $("rouletteRoundStakeSummary").textContent =
                    `Total staked this round: ${
                        shortMoney(totalRoundStake)
                    } chips`;
            }

            $("rouletteBetsBox").innerHTML =
                !myBets.length
                    ? '<div class="emptyState">No roulette bets yet.</div>'
                    : myBets.map(bet => `
                        <div class="betRow">
                            <div class="betLeft">
                                ${rouletteBetLabel(bet)}
                            </div>
                            <div class="betRight">
                                ${shortMoney(bet.amount)}
                            </div>
                        </div>
                    `).join("");

            $("rouletteClearBetsButton").disabled =
                roulette.spinning ||
                !myBets.length;

            $("roulettePlaceBetButton").disabled =
                roulette.spinning ||
                !autoUserId;

            const history =
                roulette.history || [];

            $("rouletteHistoryBox").innerHTML =
                !history.length
                    ? '<div class="emptyState">No roulette spins yet.</div>'
                    : history.slice(0, 10).map(entry => `
                        <div class="historyRow">
                            <div>
                                ${entry.winningNumber}
                                (${entry.winningColor})
                            </div>
                            <div class="betRight">
                                ${
                                    (entry.results || [])
                                        .filter(
                                            result =>
                                                String(result.playerId) ===
                                                String(autoUserId)
                                        )
                                        .reduce(
                                            (sum, result) =>
                                                sum + Number(
                                                    result.profit || 0
                                                ),
                                            0
                                        ) >= 0
                                        ? "+"
                                        : ""
                                }${shortMoney(
                                    (entry.results || [])
                                        .filter(
                                            result =>
                                                String(result.playerId) ===
                                                String(autoUserId)
                                        )
                                        .reduce(
                                            (sum, result) =>
                                                sum + Number(
                                                    result.profit || 0
                                                ),
                                            0
                                        )
                                )}
                            </div>
                        </div>
                    `).join("");

            if (
                roulette.activeSpin &&
                roulette.activeSpin.spinId !==
                    rouletteVisualSpinId
            ) {
                rouletteVisualSpinId =
                    roulette.activeSpin.spinId;

                const number =
                    Number(
                        roulette.activeSpin.winningNumber
                    );

                const winningColor =
                    String(
                        roulette.activeSpin.winningColor ||
                        ""
                    ).toUpperCase();

                const durationMs =
                    Number(
                        roulette.activeSpin.durationMs ||
                        4300
                    );

                rouletteWheelRotation +=
                    1440 + number * 9.73;

                $("rouletteWheel").style.transform =
                    `rotate(${rouletteWheelRotation}deg)`;

                $("rouletteResultText").textContent =
                    "Wheel spinning...";

                $("rouletteResultSub").textContent =
                    "No more bets";

                setTimeout(() => {
                    const resultNumber =
                        $("rouletteResult");
                    const resultText =
                        $("rouletteResultText");
                    const resultSub =
                        $("rouletteResultSub");

                    if (resultNumber) {
                        resultNumber.textContent =
                            String(number);
                    }

                    if (resultText) {
                        resultText.textContent =
                            `${number} ${winningColor}`;
                    }

                    if (resultSub) {
                        resultSub.textContent =
                            "Round complete";
                    }
                }, durationMs);
            }

        }

        $("crashPlaceBetButton").onclick = async () => {
            const playerId = String(
                autoUserId || ""
            ).trim();

            const playerName = String(
                autoName || ""
            ).trim();

            const amount = parseMoneyInput(
                $("crashBetAmount").value
            );

            if (!playerId || !playerName) {
                setStatus(
                    "NO GAME DATA",
                    2500
                );
                return;
            }

            if (!amount) {
                setStatus(
                    "ENTER A VALID CRASH BET",
                    2500
                );
                return;
            }

            try {
                const json = await apiRequest(
                    "/crash/start",
                    {
                        method: "POST",
                        body: {
                            playerId,
                            playerName,
                            amount
                        }
                    }
                );

                state = json.state || state;

                if (Number(json.serverTime)) {
                    window.casinoServerClockOffset =
                        Number(json.serverTime) -
                        Date.now();
                }

                $("crashBetAmount").value = "";

                setStatus(
                    "CRASH STARTED",
                    1600
                );

                render();
            } catch (error) {
                setStatus(
                    error.message ||
                    "CRASH FAILED",
                    3500
                );
            }
        };

        $("crashCashoutButton").onclick = async () => {
            const playerId = String(
                autoUserId || ""
            ).trim();

            if (!playerId) {
                setStatus(
                    "NO GAME DATA",
                    2500
                );
                return;
            }

            try {
                const json = await apiRequest(
                    "/crash/cashout",
                    {
                        method: "POST",
                        body: {
                            playerId
                        }
                    }
                );

                state = json.state || state;

                setStatus(
                    `CASHED OUT AT X${Number(
                        json.multiplier || 0
                    ).toFixed(2)}`,
                    3000
                );

                showWinEffect();
                render();
            } catch (error) {
                await refreshState(true);

                setStatus(
                    error.message ||
                    "TOO LATE",
                    3500
                );
            }
        };

        $("refreshLeaderboardButton").onclick =
            loadGamblingLeaderboard;

        setInterval(
            loadGamblingLeaderboard,
            30000
        );

        setTimeout(
            loadGamblingLeaderboard,
            1500
        );

        async function placeRouletteBet() {
            if (!selectedRouletteBet.betType) {
                throw new Error(
                    "Choose a roulette bet first"
                );
            }

            const amount =
                parseMoneyInput(
                    $("rouletteBetInput").value
                );

            if (!amount) {
                throw new Error(
                    "Enter a valid roulette bet"
                );
            }

            const json = await apiRequest(
                "/roulette/place-bet",
                {
                    method: "POST",
                    body: {
                        playerId: autoUserId,
                        playerName: autoName,
                        amount,
                        betType:
                            selectedRouletteBet.betType,
                        selection:
                            selectedRouletteBet.selection
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error ||
                    "Could not place roulette bet"
                );
            }

            state = json.state || state;
            render();
        }

        async function clearMyRouletteBets() {
            const json = await apiRequest(
                "/roulette/clear-my-bets",
                {
                    method: "POST",
                    body: {
                        playerId: autoUserId
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error ||
                    "Could not clear roulette bets"
                );
            }

            state = json.state || state;
            render();
        }

        function renderDealGame() {
            const dealState = state.deal || {};

            const activeGame =
                dealState.games?.[String(autoUserId)] ||
                null;

            const showingFinishedView =
                dealFinishedView &&
                Date.now() < dealFinishedViewUntil;

            const game =
                activeGame ||
                (showingFinishedView
                    ? dealFinishedView
                    : null);
            const caseCount =
                Number(dealState.caseCount || 16);

            const grid = $("dealCaseGrid");
            const offerBox = $("dealOfferBox");
            const offerAmount = $("dealOfferAmount");

            if (!grid) return;

            grid.innerHTML = Array.from(
                { length: caseCount },
                (_, index) => {
                    const opened =
                        game?.openedCases?.includes(index);

                    const chosen =
                        game
                            ? index === game.chosenCase
                            : index === selectedDealCase;

                    const finishedChosen =
                        showingFinishedView &&
                        chosen;

                    const value =
                        finishedChosen
                            ? game.chosenValue
                            : game?.openedValues?.[index];

                    return `
                        <button
                            class="dealCase ${
                                opened ? "opened" : ""
                            } ${
                                chosen ? "chosen" : ""
                            } ${
                                finishedChosen
                                    ? "finalChosen"
                                    : ""
                            }"
                            data-case="${index}"
                            ${
                                showingFinishedView ||
                                opened ||
                                (game && chosen)
                                    ? "disabled"
                                    : ""
                            }
                        >
                            CASE ${index + 1}
                            ${
                                finishedChosen
                                    ? `<span class="dealCaseValue">${
                                        game.acceptedDeal
                                            ? "YOUR CASE WAS"
                                            : "YOUR CASE"
                                    }: ${shortMoney(value)}</span>`
                                    : opened
                                        ? `<span class="dealCaseValue">${shortMoney(value)}</span>`
                                        : chosen
                                            ? `<span class="dealCaseValue">YOUR CASE</span>`
                                            : ""
                            }
                        </button>
                    `;
                }
            ).join("");

            grid.querySelectorAll(".dealCase").forEach(
                button => {
                    button.addEventListener("click", () => {
                        const index = Number(
                            button.dataset.case
                        );

                        if (showingFinishedView) {
                            return;
                        }

                        if (!game) {
                            selectedDealCase = index;
                            renderDealGame();
                            return;
                        }

                        openDealCase(index);
                    });
                }
            );

            const offer = Number(
                game?.currentOffer || 0
            );

            offerBox?.classList.toggle(
                "active",
                offer > 0
            );

            if (offerAmount) {
                offerAmount.textContent =
                    shortMoney(offer) + " chips";
            }

            $("dealStatusText").textContent =
                showingFinishedView
                    ? game.acceptedDeal
                        ? `Accepted ${shortMoney(
                            game.acceptedOffer || 0
                        )} • Your case held ${shortMoney(
                            game.chosenValue || 0
                        )}`
                        : `Your case contained ${shortMoney(
                            game.chosenValue || 0
                        )} chips`
                    : !game
                        ? selectedDealCase == null
                            ? "Choose your case"
                            : `Case ${selectedDealCase + 1} selected`
                        : offer > 0
                            ? "Deal or No Deal?"
                            : `Open ${game.casesToOpen || 0} more case${
                                game.casesToOpen === 1 ? "" : "s"
                            }`;

            $("dealStartButton").disabled =
                showingFinishedView ||
                !!activeGame ||
                selectedDealCase == null ||
                !autoUserId;

            $("dealBetInput").disabled =
                showingFinishedView ||
                !!activeGame;

            const displayBet = game
                ? game.betAmount
                : parseMoneyInput(
                    $("dealBetInput")?.value
                );

            $("dealPrizeList").innerHTML =
                DEAL_PRIZE_MULTIPLIERS.map(
                    multiplier => `
                        <div class="dealPrize">
                            x${multiplier}
                            <b style="float:right;color:#ffd84d">
                                ${
                                    displayBet
                                        ? shortMoney(
                                            displayBet *
                                            multiplier
                                        )
                                        : "—"
                                }
                            </b>
                        </div>
                    `
                ).join("");

            const history = dealState.history || [];

            $("dealHistoryBox").innerHTML =
                !history.length
                    ? '<div class="emptyState">No deal games yet.</div>'
                    : history
                        .filter(
                            entry =>
                                String(entry.playerId) ===
                                String(autoUserId)
                        )
                        .slice(0, 8)
                        .map(entry => `
                            <div class="historyRow">
                                <div>
                                    ${entry.result === "deal"
                                        ? "Accepted deal"
                                        : "Kept chosen case"}
                                </div>
                                <div class="betRight">
                                    ${shortMoney(entry.payout)}
                                    (${entry.profit >= 0 ? "+" : ""}${shortMoney(entry.profit)})
                                </div>
                            </div>
                        `)
                        .join("") ||
                        '<div class="emptyState">No deal games yet.</div>';
        }

        async function startDealGame() {
            if (selectedDealCase == null) {
                throw new Error("Choose your case first");
            }

            const amount = parseMoneyInput(
                $("dealBetInput").value
            );

            if (!amount) {
                throw new Error("Enter a valid bet");
            }

            const json = await apiRequest(
                "/deal/start",
                {
                    method: "POST",
                    body: {
                        playerId: autoUserId,
                        playerName: autoName,
                        amount,
                        chosenCase: selectedDealCase
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error || "Could not start game"
                );
            }

            state = json.state || state;
            render();
        }

        async function openDealCase(caseIndex) {
            const currentGameBeforeOpen =
                state.deal?.games?.[
                    String(autoUserId)
                ] || null;

            const previousOpenedCases = [
                ...(
                    currentGameBeforeOpen?.openedCases || []
                )
            ];

            const previousOpenedValues = {
                ...(
                    currentGameBeforeOpen?.openedValues || {}
                )
            };

            const previousChosenCase =
                currentGameBeforeOpen?.chosenCase;

            const previousBetAmount =
                currentGameBeforeOpen?.betAmount || 0;

            const json = await apiRequest(
                "/deal/open-case",
                {
                    method: "POST",
                    body: {
                        playerId: autoUserId,
                        caseIndex
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error || "Could not open case"
                );
            }

            state = json.state || state;

            if (json.finished) {
                selectedDealCase = null;

                dealFinishedView = {
                    chosenCase:
                        json.history?.chosenCase ??
                        previousChosenCase ??
                        0,
                    chosenValue:
                        Number(
                            json.chosenValue || 0
                        ),
                    openedCases: Array.from(
                        new Set([
                            ...previousOpenedCases,
                            ...(json.history?.openedCases || []),
                            json.openedCase
                        ])
                    ).filter(
                        value =>
                            Number.isInteger(value)
                    ),
                    openedValues: {
                        ...previousOpenedValues,
                        [json.openedCase]:
                            json.openedValue
                    },
                    currentOffer: 0,
                    casesToOpen: 0,
                    betAmount:
                        json.history?.betAmount ||
                        previousBetAmount
                };

                dealFinishedViewUntil =
                    Date.now() + 8000;

                if (dealFinishedViewTimer) {
                    clearTimeout(
                        dealFinishedViewTimer
                    );
                }

                dealFinishedViewTimer =
                    setTimeout(() => {
                        dealFinishedView = null;
                        dealFinishedViewUntil = 0;
                        dealFinishedViewTimer = null;
                        render();
                    }, 8000);

                showWinEffect();

                setStatus(
                    `Your case contained ${shortMoney(
                        json.chosenValue || 0
                    )} chips`,
                    7000
                );
            } else if (json.offer > 0) {
                setStatus(
                    `Banker offer: ${shortMoney(json.offer)}`,
                    3500
                );
            }

            render();
        }

        async function answerDealOffer(accept) {
            const currentGameBeforeAnswer =
                state.deal?.games?.[
                    String(autoUserId)
                ] || null;

            const json = await apiRequest(
                accept
                    ? "/deal/accept"
                    : "/deal/reject",
                {
                    method: "POST",
                    body: {
                        playerId: autoUserId
                    }
                }
            );

            if (!json.ok) {
                throw new Error(
                    json.error || "Could not answer offer"
                );
            }

            state = json.state || state;

            if (accept) {
                selectedDealCase = null;

                const allCaseValues = Array.isArray(
                    json.allCaseValues
                )
                    ? json.allCaseValues
                    : [];

                const openedValues = {};

                allCaseValues.forEach(
                    (value, index) => {
                        openedValues[index] =
                            Number(value || 0);
                    }
                );

                const chosenCase =
                    Number.isInteger(json.chosenCase)
                        ? json.chosenCase
                        : (
                            currentGameBeforeAnswer?.chosenCase ??
                            json.history?.chosenCase ??
                            0
                        );

                const chosenValue = Number(
                    json.chosenValue ??
                    allCaseValues[chosenCase] ??
                    json.history?.chosenValue ??
                    0
                );

                const acceptedOffer = Number(
                    json.payout || 0
                );

                dealFinishedView = {
                    chosenCase,
                    chosenValue,
                    acceptedOffer,
                    acceptedDeal: true,
                    openedCases: Array.from(
                        {
                            length:
                                Number(
                                    state.deal?.caseCount ||
                                    allCaseValues.length ||
                                    16
                                )
                        },
                        (_, index) => index
                    ),
                    openedValues,
                    currentOffer: 0,
                    casesToOpen: 0,
                    betAmount:
                        json.history?.betAmount ||
                        currentGameBeforeAnswer?.betAmount ||
                        0
                };

                dealFinishedViewUntil =
                    Date.now() + 8000;

                if (dealFinishedViewTimer) {
                    clearTimeout(
                        dealFinishedViewTimer
                    );
                }

                dealFinishedViewTimer =
                    setTimeout(() => {
                        dealFinishedView = null;
                        dealFinishedViewUntil = 0;
                        dealFinishedViewTimer = null;
                        render();
                    }, 8000);

                const difference =
                    acceptedOffer - chosenValue;

                showWinEffect();

                setStatus(
                    difference >= 0
                        ? `Great deal: ${shortMoney(
                            acceptedOffer
                        )} accepted, ${shortMoney(
                            difference
                        )} more than your case`
                        : `Deal accepted: ${shortMoney(
                            acceptedOffer
                        )}; your case held ${shortMoney(
                            chosenValue
                        )}`,
                    7000
                );
            }

            render();
        }

        function renderMines() {
            const minesState =
                state.mines || {};

            if (minesFinishedView) {
                buildMinesBoard(
                    {
                        revealed: minesFinishedView.revealed,
                        finished: true
                    },
                    minesFinishedView.minePositions
                );

                $('minesStatusText').textContent =
                    minesFinishedView.statusText;

                $('minesSafeCount').textContent =
                    String(
                        minesFinishedView.safeReveals || 0
                    );

                $('minesMultiplier').textContent =
                    `x${Number(
                        minesFinishedView.multiplier || 0
                    ).toFixed(2)}`;

                $('minesPotentialPayout').textContent =
                    shortMoney(
                        minesFinishedView.payout || 0
                    );

                $('minesStartButton').disabled = false;
                $('minesCashoutButton').disabled = false;
                $('minesBetInput').disabled = false;
                $('minesCountInput').disabled = false;

                return;
            }

            const game = getMyMinesGame();

            const history = (
                minesState.history || []
            )
                .filter(
                    item =>
                        String(item.playerId) ===
                        String(autoUserId)
                )
                .slice(0, 8);

            buildMinesBoard(game);

            $('minesSafeCount').textContent =
                game
                    ? String(game.safeReveals || 0)
                    : '0';

            $('minesMultiplier').textContent =
                game
                    ? `x${Number(
                        game.multiplier || 1
                    ).toFixed(2)}`
                    : 'x1.00';

            $('minesPotentialPayout').textContent =
                game
                    ? shortMoney(
                        game.potentialPayout || 0
                    )
                    : '0';

            $('minesStatusText').textContent =
                game
                    ? `${game.mineCount} mines • choose a tile`
                    : 'Start a game';

            $('minesStartButton').disabled =
                !!game ||
                !autoUserId ||
                !autoName;

            $('minesCashoutButton').disabled =
                !game ||
                Number(game.safeReveals || 0) < 1;

            $('minesBetInput').disabled =
                !!game;

            $('minesCountInput').disabled =
                !!game;

            $('minesHistoryBox').innerHTML =
                !history.length
                    ? '<div class="emptyState">No Mines games yet.</div>'
                    : history.map(item => {
                        const won =
                            Number(item.payout || 0) > 0;

                        return `
                              <div class="historyRow">
                                <div>
                                  ${Number(item.mineCount || 0)} mines •
                                  ${Number(item.safeReveals || 0)} safe picks •
                                  ${escapeHtml(item.result || '')}
                                </div>
                                <div class="betRight ${won ? 'win' : 'loss'}">
                                  ${won ? '+' : '-'}${shortMoney(
                            won
                                ? item.payout
                                : item.betAmount
                        )}
                                </div>
                              </div>
                            `;
                    }).join('');
        }

        function renderSlots() {
            const slots = state.slots || {};
            const mine = (slots.history || []).filter(h => String(h.playerId) === String(autoUserId)).slice(0, 8);
            const latest = mine[0];
            const free =
                getDisplayedSlotFreeSpins();
            $('slotFreeSpins').textContent = free;
            $('slotModeText').textContent =
                free > 0
                    ? `FREE SPINS READY (${free})`
                    : 'Paid spin';
            $('slotLastBet').textContent = latest ? shortMoney(latest.betAmount) : '0';
            const slotLastWinElement = $('slotLastWin');

            if (slotLastWinElement) {
                slotLastWinElement.textContent =
                    latest
                        ? shortMoney(latest.payout)
                        : '0';
            }
            updateFreeSpinDisplay();
            $('slotHistoryBox').innerHTML = !mine.length ? '<div class="emptyState">No slot spins yet.</div>' : mine.map(h =>
                `<div class="historyRow"><div>${h.freeSpin ? '🎁 Free Spin' : '🎰 Paid Spin'}${h.bonusMultiplier > 1 ? ` • Bonus x${h.bonusMultiplier}` : ''}</div><div class="betRight ${h.profit > 0 ? 'win' : h.profit < 0 ? 'loss' : 'neutral'}">${h.profit >= 0 ? '+' : ''}${shortMoney(h.profit)}</div></div>`
            ).join('');
            renderSlotPaytable();
            if (!latest) buildSlotGrid();
        }

        function renderCards(cards) {
            return (cards || []).map(c => `<div class="card ${c.suit === '♥' || c.suit === '♦' ? 'red' : ''} ${c.rank === '?' ? 'cardBack' : ''}">${escapeHtml((c.rank || '?') + (c.suit || ''))}</div>`).join('')
        }

        function updateAutomaticGameCountdowns() {
            const now =
                Date.now() +
                Number(window.casinoServerClockOffset || 0);

            const configs = [
                {
                    elementId: 'wheelAutoCountdown',
                    game: state.wheel || {},
                    running: !!state.wheel?.spinning,
                    runningText: 'Wheel spinning...'
                },
                {
                    elementId: 'blackjackAutoCountdown',
                    game: state.blackjack || {},
                    running: state.blackjack?.status === 'playing',
                    runningText: 'Blackjack round running...'
                },
                {
                    elementId: 'racingAutoCountdown',
                    game: state.racing || {},
                    running: !!state.racing?.racing,
                    runningText: 'Race running...'
                },
                {
                    elementId: 'rouletteAutoCountdown',
                    game: state.roulette || {},
                    running: !!state.roulette?.spinning,
                    runningText: 'Roulette wheel spinning...'
                }
            ];

            configs.forEach(config => {
                const element = $(config.elementId);
                if (!element) return;

                element.classList.remove('active', 'starting');

                if (config.running) {
                    element.textContent = config.runningText;
                    element.classList.add('starting');
                    return;
                }

                const startsAt = Number(
                    config.game.autoStartAt ||
                    config.game.countdownEndsAt ||
                    config.game.startsAt ||
                    0
                );

                if (!startsAt) {
                    element.textContent = 'Waiting for first bet';
                    return;
                }

                const remainingMs = startsAt - now;
                const seconds = Math.max(0, Math.ceil(remainingMs / 1000));

                if (remainingMs <= 0) {
                    element.textContent = 'Starting game...';
                    element.classList.add('starting');
                    return;
                }

                element.textContent = `Automatic start in ${seconds}s`;
                element.classList.add('active');
            });
        }
        let crashAnimationFrame = null;
        let lastCrashGameId = "";
        let crashStatusPollTimer = null;
        let crashAuthoritativeMultiplier = 1;
        let crashLastStatusAt = 0;
        let crashStatusRequestRunning = false;

        function stopCrashStatusPolling() {
            if (crashStatusPollTimer) {
                clearTimeout(
                    crashStatusPollTimer
                );
                crashStatusPollTimer = null;
            }

            crashStatusRequestRunning = false;
        }

        async function pollCrashStatus() {
            const playerId = String(
                autoUserId || ""
            ).trim();

            const activeGame =
                state.crash?.games?.[
                    playerId
                ] || null;

            if (!playerId || !activeGame) {
                stopCrashStatusPolling();
                return;
            }

            if (crashStatusRequestRunning) {
                crashStatusPollTimer =
                    setTimeout(
                        pollCrashStatus,
                        100
                    );
                return;
            }

            crashStatusRequestRunning = true;

            try {
                const json = await apiRequest(
                    `/crash/status?playerId=${encodeURIComponent(
                        playerId
                    )}`
                );

                if (Number(json.serverTime)) {
                    window.casinoServerClockOffset =
                        Number(json.serverTime) -
                        Date.now();
                }

                crashLastStatusAt = Date.now();

                if (json.running) {
                    crashAuthoritativeMultiplier =
                        Math.max(
                            1,
                            Number(
                                json.multiplier || 1
                            )
                        );
                } else {
                    crashAuthoritativeMultiplier =
                        Number(
                            json.latestResult?.crashPoint ||
                            json.latestResult?.cashoutMultiplier ||
                            1
                        );

                    await refreshState(true);
                    stopCrashStatusPolling();
                    return;
                }
            } catch (error) {
                console.error(
                    "Crash status sync failed:",
                    error
                );
            } finally {
                crashStatusRequestRunning = false;
            }

            crashStatusPollTimer =
                setTimeout(
                    pollCrashStatus,
                    100
                );
        }

        function startCrashStatusPolling() {
            if (crashStatusPollTimer) {
                return;
            }

            pollCrashStatus();
        }

        function getCrashServerNow() {
            return Date.now() +
                Number(
                    window.casinoServerClockOffset || 0
                );
        }

        function getSoloCrashMultiplier(game) {
            if (!game || game.status !== "running") {
                return 1;
            }

            const serverNow =
                getCrashServerNow();

            const elapsedSeconds = Math.max(
                0,
                (
                    serverNow -
                    Number(
                        game.startedAt ||
                        serverNow
                    )
                ) / 1000
            );

            const locallyCalculated =
                Math.max(
                    1,
                    Math.floor(
                        Math.exp(
                            Number(
                                game.growthRate || 0.12
                            ) *
                            elapsedSeconds
                        ) * 100
                    ) / 100
                );

            if (
                crashLastStatusAt > 0 &&
                Date.now() -
                    crashLastStatusAt <
                    500
            ) {
                // Never display more than 0.03x above the latest
                // multiplier confirmed by the backend.
                return Math.min(
                    locallyCalculated,
                    crashAuthoritativeMultiplier +
                    0.03
                );
            }

            return crashAuthoritativeMultiplier ||
                locallyCalculated;
        }

        function animateCrash() {
            const game =
                state.crash?.games?.[
                    String(autoUserId)
                ] || null;

            const multiplierEl =
                $("crashMultiplier");

            const rocketEl =
                $("crashRocket");

            if (!multiplierEl || !rocketEl) {
                return;
            }

            if (!game) {
                return;
            }

            const multiplier =
                getSoloCrashMultiplier(game);

            multiplierEl.textContent =
                `${multiplier.toFixed(2)}×`;

            multiplierEl.classList.remove(
                "crashed"
            );

            const cashoutButton =
                $("crashCashoutButton");

            if (cashoutButton) {
                cashoutButton.textContent =
                    `Cash Out at ${multiplier.toFixed(2)}×`;
            }

            const progress = Math.min(
                1,
                Math.log(
                    Math.max(1, multiplier)
                ) / Math.log(12)
            );

            rocketEl.style.left =
                `${10 + progress * 72}%`;

            rocketEl.style.bottom =
                `${18 + progress * 135}px`;

            rocketEl.style.transform =
                `rotate(${
                    -35 + progress * 18
                }deg) scale(${
                    1 + progress * 0.15
                })`;

            crashAnimationFrame =
                requestAnimationFrame(
                    animateCrash
                );
        }

        function renderCrash() {
            const crash =
                state.crash || {
                    games: {},
                    history: []
                };

            const game =
                crash.games?.[
                    String(autoUserId)
                ] || null;

            if ($("crashBalance")) {
                $("crashBalance").textContent =
                    shortMoney(
                        getMyChipBalance()
                    );
            }

            if ($("crashBetStatus")) {
                $("crashBetStatus").innerHTML =
                    game
                        ? `🚀 Active bet: <b>${shortMoney(
                            game.betAmount
                        )}</b> chips`
                        : "Enter a bet to begin your own Crash game.";
            }

            if ($("crashPlaceBetButton")) {
                $("crashPlaceBetButton").disabled =
                    !!game;
            }

            if ($("crashBetAmount")) {
                $("crashBetAmount").disabled =
                    !!game;
            }

            if ($("crashCashoutButton")) {
                $("crashCashoutButton").disabled =
                    !game;

                $("crashCashoutButton").textContent =
                    game
                        ? `Cash Out at ${getSoloCrashMultiplier(
                            game
                        ).toFixed(2)}×`
                        : "Cash Out";
            }

            const history =
                (crash.history || [])
                    .filter(
                        entry =>
                            String(entry.playerId) ===
                            String(autoUserId)
                    )
                    .slice(0, 10);

            if ($("crashHistoryBox")) {
                $("crashHistoryBox").innerHTML =
                    !history.length
                        ? '<div class="emptyState">No Crash games yet.</div>'
                        : history.map(entry => `
                            <div class="historyRow">
                                <div>
                                    ${
                                        entry.result === "cashout"
                                            ? `Cashed out at ${Number(
                                                entry.cashoutMultiplier || 0
                                            ).toFixed(2)}×`
                                            : `Crashed at ${Number(
                                                entry.crashPoint || 0
                                            ).toFixed(2)}×`
                                    }
                                </div>
                                <div class="betRight ${
                                    Number(entry.profit || 0) >= 0
                                        ? "win"
                                        : "loss"
                                }">
                                    ${
                                        entry.result === "cashout"
                                            ? `Returned ${shortMoney(
                                                entry.payout || 0
                                            )}<br><span style="font-size:10px;opacity:.8;">Profit ${
                                                Number(entry.profit || 0) >= 0
                                                    ? "+"
                                                    : ""
                                            }${shortMoney(
                                                entry.profit || 0
                                            )}</span>`
                                            : `-${shortMoney(
                                                entry.betAmount || 0
                                            )}`
                                    }
                                </div>
                            </div>
                        `).join("");
            }

            if (game) {
                if (
                    lastCrashGameId !==
                    game.gameId
                ) {
                    lastCrashGameId =
                        game.gameId;

                    crashAuthoritativeMultiplier = 1;
                    crashLastStatusAt = 0;
                    startCrashStatusPolling();

                    if (crashAnimationFrame) {
                        cancelAnimationFrame(
                            crashAnimationFrame
                        );
                        crashAnimationFrame = null;
                    }

                    if ($("crashRocket")) {
                        $("crashRocket").style.left =
                            "10%";
                        $("crashRocket").style.bottom =
                            "18px";
                        $("crashRocket").style.transform =
                            "rotate(-35deg) scale(1)";
                    }

                    animateCrash();
                } else {
                    startCrashStatusPolling();

                    if (!crashAnimationFrame) {
                        animateCrash();
                    }
                }
            } else {
                stopCrashStatusPolling();

                if (crashAnimationFrame) {
                    cancelAnimationFrame(
                        crashAnimationFrame
                    );
                    crashAnimationFrame = null;
                }

                if ($("crashMultiplier")) {
                    const latest =
                        history[0];

                    $("crashMultiplier").textContent =
                        latest?.result === "crashed"
                            ? `${Number(
                                latest.crashPoint || 1
                            ).toFixed(2)}×`
                            : "1.00×";

                    $("crashMultiplier").classList.toggle(
                        "crashed",
                        latest?.result === "crashed"
                    );
                }
            }
        }

                let leaderboardLoading = false;

        async function loadGamblingLeaderboard() {
            if (leaderboardLoading) return;

            const playerId = String(
                autoUserId || ""
            ).trim();

            if (!playerId) return;

            leaderboardLoading = true;

            try {
                const json = await apiRequest(
                    `/chips/leaderboard?playerId=${encodeURIComponent(
                        playerId
                    )}`
                );

                const leaderboard =
                    json.leaderboard || {};

                const top10 =
                    Array.isArray(
                        leaderboard.top10
                    )
                        ? leaderboard.top10
                        : [];

                const box =
                    $("gamblingLeaderboardBox");

                if (box) {
                    box.innerHTML =
                        !top10.length
                            ? '<div class="emptyState">No gambling stats yet.</div>'
                            : top10.map(entry => {
                                const lost =
                                    Number(
                                        entry.moneyLost || 0
                                    );

                                return `
                                    <div class="betRow">
                                        <div class="betLeft">
                                            <b>#${entry.position}</b>
                                            ${escapeHtml(
                                                entry.playerName
                                            )}
                                            ${
                                                String(entry.playerId) ===
                                                String(autoUserId)
                                                    ? " 👈"
                                                    : ""
                                            }
                                        </div>
                                        <div class="betRight">
                                            Spent ${shortMoney(
                                                entry.moneySpent
                                            )}
                                            <br>
                                            <span style="font-size:10px;opacity:.8;">
                                                ${
                                                    lost >= 0
                                                        ? `Lost ${shortMoney(lost)}`
                                                        : `Profit +${shortMoney(Math.abs(lost))}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                `;
                            }).join("");
                }

                const positionBox =
                    $("myLeaderboardPosition");

                if (positionBox) {
                    if (
                        leaderboard.myPosition &&
                        leaderboard.myPosition > 10
                    ) {
                        positionBox.innerHTML =
                            `Your position: <b>#${leaderboard.myPosition}</b> of ${leaderboard.totalGamblers}`;
                    } else if (
                        leaderboard.myPosition
                    ) {
                        positionBox.innerHTML =
                            `You are currently <b>#${leaderboard.myPosition}</b> on the leaderboard.`;
                    } else {
                        positionBox.textContent =
                            "Place a casino bet to join the leaderboard.";
                    }
                }
            } catch (error) {
                console.error(
                    "Leaderboard load failed:",
                    error
                );
            } finally {
                leaderboardLoading = false;
            }
        }

function render() {
            registerCasinoPlayer().catch(error => {
                console.error(
                    "Casino player registration failed:",
                    error
                );
            });
            updateAutomaticGameCountdowns();
            renderSlots();
            renderMines();
            renderDealGame();

            try {
                renderRoulette();
            } catch (error) {
                console.error(
                    "Roulette render failed:",
                    error
                );
            }

            renderCrash();

            const chipState = getChipState();
            const chipBalance = getMyChipBalance();
            const requests = Array.isArray(chipState.requests) ? chipState.requests : [];
            const myRequest = requests.find(r => String(r.playerId) === String(autoUserId));
            $('chipBalance').textContent = shortMoney(chipBalance) + ' chips';
            document.querySelectorAll('.gameChipBalance').forEach(el => el.textContent = shortMoney(chipBalance) + ' chips');
            $('chipPlayerLabel').textContent = autoName ? `${autoName} (${autoUserId})` : 'Waiting for player...';
            $('chipRequestStatus').textContent = myRequest
                ? `Pending request: ${shortMoney(myRequest.amount)} chips`
                : 'Ask the banker to approve your chip purchase.';
            $('requestChipsButton').disabled = !autoUserId || !autoName || !!myRequest;
            $('chipBankerControls').style.display =
                isBanker() && adminToken
                    ? 'block'
                    : 'none';

            $('dailyProfitPanel').style.display =
                isBanker() && adminToken
                    ? 'block'
                    : 'none';
            $('chipRequestsBox').innerHTML = !requests.length
                ? '<div class="emptyState">No chip requests.</div>'
                : requests.map(r => `
                        <div class="bankerRequest">
                          <div class="betRow">
                            <div class="betLeft"><b>${escapeHtml(r.playerName)}</b> (${escapeHtml(r.playerId)})</div>
                            <div class="betRight">${shortMoney(r.amount)} chips</div>
                          </div>
                          <div class="bankerRequestActions">
                            <button class="green" onclick="grantChips('${escapeHtml(r.playerId)}', ${Number(r.amount) || 0}, '${escapeHtml(r.requestId || r.id || '')}', '${escapeHtml(r.playerName)}')">Approve</button>
                            <button class="danger" onclick="rejectChipRequest('${escapeHtml(r.requestId || r.id || '')}')">Reject</button>
                          </div>
                        </div>`).join('');

            const wheelState = state.wheel || {};
            const bets = wheelState.bets || []
                , confirmed = bets.filter(b => b.confirmed).length
                , total = bets.reduce((s, b) => s + Number(b.amount || 0), 0);
            $('betsBox').innerHTML = !bets.length ? '<div class="emptyState">No bets yet.</div>' : bets.map(b => `<div class="betRow"><div class="betLeft">${escapeHtml(b.playerName)} ${b.confirmed ? '✅' : '⌛'}</div><div class="betRight">${shortMoney(b.amount)}</div></div>`).join('') + `<div class="small">Confirmed: ${confirmed}/${bets.length} • Pot: ${shortMoney(total)}</div>`;
            const wheellast = wheelState.history && wheelState.history[0];
            if (wheellast) {
                maybeShowRoundResultPopup("wheel", wheellast); $('historyBox').innerHTML = wheelState.history.slice(0, 5).map(h => `<div class="historyRow"><div>${(h.results || []).map(r => `${escapeHtml(r.playerName)}: ${shortMoney(r.amount)} → x${r.multiplier} → ${shortMoney(r.payout)} (${r.profit >= 0 ? '+' : ''}${shortMoney(r.profit)})`).join('<br>')}</div></div>`)
                    .join('');
            } else {
                $('historyBox').innerHTML = '<div class="emptyState">No spins yet.</div>';
            }
            const unlocked = !!adminToken;
            $('confirmAllButton').disabled = !unlocked || !bets.length || wheelState.spinning;
            $('spinButton').disabled = !unlocked || !bets.length || wheelState.spinning || confirmed !== bets.length;
            $('clearRoundButton').disabled = !unlocked || wheelState.spinning;
            const bj = state.blackjack || {};

            $('bjTableStatus').textContent = bj.status === 'playing'
                ? `Current turn: ${bj.currentTurnName || 'Player'}`
                : bj.status === 'finished'
                    ? 'Round finished. Banker can reset/start next table.'
                    : 'Waiting for blackjack bets.';

            $('dealerCards').innerHTML = renderCards(bj.dealerHand || []);
            $('dealerTotal').textContent = bj.dealerTotal ? ('Total: ' + bj.dealerTotal) : 'Total: --';

            $('bjTurnText').textContent = bj.status === 'playing'
                ? `Turn: ${bj.currentTurnName}`
                : (bj.status || 'waiting');

            const bjBets = bj.bets || [];
            const bjPlayers = bj.players || [];

            const localPlayer = bjPlayers.find(p => p.playerId === autoUserId);

            if (localPlayer) {
                $('bjPlayerCards').innerHTML = renderCards(localPlayer.hand || []);
                $('bjPlayerTotal').textContent = 'Total: ' + (localPlayer.total || '--');
            } else {
                $('bjPlayerCards').innerHTML = '';
                $('bjPlayerTotal').textContent = 'Total: --';
            }


            let playerHtml = '';

            const otherPlayers = bjPlayers.filter(p => p.playerId !== autoUserId);

            if (bjBets.length) {
                playerHtml += bjBets
                    .filter(b => b.playerId !== autoUserId)
                    .map(b => `
                            <div class="bjRow">
                                <div class="betLeft">
                                    ${escapeHtml(b.playerName)} ${b.confirmed ? '✅' : '⌛'}
                                    <div class="small">Waiting to be dealt</div>
                                </div>
                                <div class="betRight">${shortMoney(b.amount)}</div>
                            </div>
                        `).join('');
            }

            if (otherPlayers.length) {
                playerHtml += otherPlayers.map(p => `
                        <div class="bjRow ${p.playerId === bj.currentTurnId ? 'turnGlow' : ''}">
                            <div class="betLeft">
                                <b>${escapeHtml(p.playerName)}</b>
                                • ${escapeHtml(p.status)}
                                • Total ${p.total}
                                <div class="cards">${renderCards(p.hand)}</div>
                            </div>
                            <div class="betRight">
                                ${p.payout ? shortMoney(p.payout) : shortMoney(p.amount)}
                            </div>
                        </div>
                    `).join('');
            }

            $('bjPlayersBox').innerHTML = playerHtml || '<div class="emptyState">No other blackjack players yet.</div>';

            $('bjHitButton').disabled = !(bj.status === 'playing' && bj.currentTurnId === autoUserId);
            $('bjStandButton').disabled = $('bjHitButton').disabled;

            const bjConfirmed = bjBets.filter(b => b.confirmed).length;

            const myBlackjackBet = bjBets.find(
                bet => String(bet.playerId) === String(autoUserId)
            );

            const waitingOnBlackjack =
                !!myBlackjackBet &&
                bj.status !== 'playing';

            $('blackjackBetStatus').classList.toggle(
                'active',
                waitingOnBlackjack
            );

            $('blackjackBetStatusAmount').textContent =
                myBlackjackBet
                    ? `${shortMoney(myBlackjackBet.amount)} chips`
                    : '0 chips';

            $('blackjackBetStatusSub').textContent =
                bj.autoStartAt
                    ? 'Your chips are reserved. Waiting for auto-start.'
                    : 'Your chips are reserved. Waiting for the round to start.';

            $('bjSubmitBetButton').classList.toggle(
                'confirmedBet',
                waitingOnBlackjack
            );

            $('bjSubmitBetButton').textContent =
                waitingOnBlackjack
                    ? '✓ Bet Confirmed'
                    : 'Confirm Bet';

            $('blackjackAutoCountdown').classList.toggle(
                'betConfirmed',
                waitingOnBlackjack
            );

            if (waitingOnBlackjack) {
                $('bjTableStatus').textContent =
                    `Your ${shortMoney(myBlackjackBet.amount)} chip bet is confirmed. Waiting for the round to start.`;
            }

            $('bjConfirmAllButton').disabled = !unlocked || !bjBets.length || bj.status === 'playing';
            $('bjStartButton').disabled = !unlocked || !bjBets.length || bj.status === 'playing' || bjConfirmed !== bjBets.length;
            $('bjResetButton').disabled = !unlocked || bj.status === 'playing';

            $('bjHistoryBox').innerHTML = (!bj.history || !bj.history.length)
                ? '<div class="emptyState">No blackjack rounds yet.</div>'
                : bj.history.slice(0, 4).map(h => `
                        <div class="historyRow">
                            <div>
                                <b>Dealer ${h.dealerTotal}</b><br>
                                ${(h.results || []).map(r =>
                    `${escapeHtml(r.playerName)}: ${r.total} ${r.result} (${r.profit >= 0 ? '+' : ''}${shortMoney(r.profit)})`
                ).join('<br>')}
                            </div>
                        </div>
                    `).join('');

            const bjlast = bj.history && bj.history[0];
            if (bjlast) {
                maybeShowRoundResultPopup("blackjack", bjlast);
            }
            const race = state.racing || {};
            buildRaceHorseSelect();
            $('raceStatus').textContent = race.racing ? 'Race running...' : 'Choose a horse, bet chips, then watch the race.';
            $('raceWinnerText').textContent = race.activeRace ? ('Winner: ' + race.activeRace.winnerHorseName) : (race.history && race.history[0] ? ('Last winner: ' + race.history[0].winnerHorseName) : 'Waiting');
            renderRaceTrack(race);
            const raceBets = race.bets || []
                , raceConfirmed = raceBets.filter(b => b.confirmed).length;
            $('raceBetsBox').innerHTML = !raceBets.length ? '<div class="emptyState">No racing bets yet.</div>' : raceBets.map(b => `<div class="betRow"><div class="betLeft">${escapeHtml(b.playerName)} ${b.confirmed ? '✅' : '⌛'}<div class="small">Horse: ${escapeHtml(b.horseName)}</div></div><div class="betRight">${shortMoney(b.amount)}</div></div>`).join('');
            $('raceConfirmAllButton').disabled = !unlocked || !raceBets.length || race.racing;
            $('raceStartButton').disabled = !unlocked || !raceBets.length || race.racing || raceConfirmed !== raceBets.length;
            $('raceClearButton').disabled = !unlocked || race.racing;
            $('raceHistoryBox').innerHTML = (!race.history || !race.history.length) ? '<div class="emptyState">No races yet.</div>' : race.history.slice(0, 4).map(h => `<div class="historyRow"><div><b>${escapeHtml(h.winnerHorseName)} won</b><br>${(h.results || []).map(r => `${escapeHtml(r.playerName)} on ${escapeHtml(r.horseName)}: ${r.won ? 'won' : 'lost'} (${r.profit >= 0 ? '+' : ''}${shortMoney(r.profit)})`).join('<br>')}</div></div>`).join('');
            const racinglast = race.history && race.history[0];
            if (racinglast) {
                maybeShowRoundResultPopup("racing", racinglast);
            }
            updateBankerUI()
        }
        function setBetAmount(inputId, amount) {
            $(inputId).value = String(amount);
            document.querySelectorAll(`.quickBetButton[data-target="${inputId}"]`).forEach(b => b.classList.toggle('selected', Number(b.dataset.amount) === Number(amount)))
        }
        function applyOpacity(v) {
            const o = Math.max(.05, Math.min(1, Number(v) / 100));
            document.documentElement.style.setProperty('--overlay-opacity', String(o));
            localStorage.setItem(STORAGE_OPACITY, String(Math.round(o * 100)))
        }
        function loadOpacity() {
            const saved = localStorage.getItem(STORAGE_OPACITY) || '72';
            $('opacityInput').value = saved;
            applyOpacity(saved)
        }
        function positionSettingsPanel() {
            const panel = $('settings');
            const overlay = $('overlay');
            if (!panel || !overlay || !panel.classList.contains('open')) return;

            const gap = 10;
            const margin = 8;
            const r = overlay.getBoundingClientRect();
            const panelWidth = Math.min(260, window.innerWidth - margin * 2);

            panel.style.width = panelWidth + 'px';

            let left = r.right + gap;
            let top = r.top;


            if (left + panelWidth > window.innerWidth - margin) {
                left = r.left - panelWidth - gap;
            }


            if (left < margin) {
                left = Math.max(margin, window.innerWidth - panelWidth - margin);
                top = Math.min(window.innerHeight - margin - 220, r.bottom + gap);
            }

            top = Math.max(margin, Math.min(top, window.innerHeight - margin - Math.min(panel.scrollHeight || 260, window.innerHeight - margin * 2)));

            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
        }

        function toggleSettingsPanel() {
            const panel = $('settings');
            panel.classList.toggle('open');
            $('overlay').classList.remove('pinned');
            positionSettingsPanel();
        }

        function closeSettingsPanel() {
            $('settings').classList.remove('open');
        }

        function pinApp() {
            $('overlay').classList.add('pinned');
            closeSettingsPanel();
            window.parent.postMessage({
                type: 'pin'
            }, '*')
        }
        function saveOverlayPosition() {
            const r = $('overlay').getBoundingClientRect();
            localStorage.setItem(STORAGE_POSITION, JSON.stringify({
                left: r.left,
                top: r.top,
                width: r.width,
                height: r.height
            }))
        }
        function loadOverlayPosition() {
            try {
                const s = JSON.parse(localStorage.getItem(STORAGE_POSITION) || '{}');
                if (s.left !== undefined)
                    $('overlay').style.left = s.left + 'px';
                if (s.top !== undefined)
                    $('overlay').style.top = s.top + 'px';
                if (s.width !== undefined)
                    $('overlay').style.width = s.width + 'px';
                if (s.height !== undefined)
                    $('overlay').style.height = s.height + 'px'
            } catch (e) { }
        }

        function updateresizeHandlePosition() {
            const rect = overlay.getBoundingClientRect();

            handle.style.left = (rect.right - 10) + 'px';
            handle.style.top = (rect.bottom - 10) + 'px';
        }
        function syncOverlayContentHeight() {
            const overlay = $('overlay');
            const content = $('overlayContent');

            if (!overlay || !content) return;

            content.style.height =
                overlay.clientHeight + 'px';
        }

        function setupDragResize() {
            const overlay = $('overlay')
                , header = $('dragHeader')
                , handle = $('resizeHandle');
            let dragging = false
                , resizing = false
                , startX = 0
                , startY = 0
                , startLeft = 0
                , startTop = 0
                , startWidth = 0
                , startHeight = 0;
            header.addEventListener('mousedown', e => {
                overlay.classList.remove('pinned');
                dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const r = overlay.getBoundingClientRect();
                startLeft = r.left;
                startTop = r.top;
                e.preventDefault()
            }
            );
            handle.addEventListener('mousedown', e => {
                overlay.classList.remove('pinned');
                resizing = true;
                startX = e.clientX;
                startY = e.clientY;
                const r = overlay.getBoundingClientRect();
                startWidth = r.width;
                startHeight = r.height;
                e.preventDefault();
                e.stopPropagation()
            }
            );
            window.addEventListener('mousemove', e => {
                if (dragging) {
                    overlay.style.left = startLeft + (e.clientX - startX) + 'px';
                    overlay.style.top = startTop + (e.clientY - startY) + 'px'
                }
                if (resizing) {
                    overlay.style.width = Math.max(290, startWidth + (e.clientX - startX)) + 'px';
                    overlay.style.height = Math.max(170, startHeight + (e.clientY - startY)) + 'px'
                    updateresizeHandlePosition();

                }
                positionSettingsPanel();

                const activeTabButton =
                    document.querySelector(
                        '.tabButton.active'
                    );

                if (activeTabButton) {
                    requestAnimationFrame(() => {
                        positionTabIndicator(activeTabButton);
                        updateArrows();
                    });
                }
            }
            );
            window.addEventListener('mouseup', () => {
                if (dragging || resizing)
                    saveOverlayPosition();
                syncOverlayContentHeight();
                dragging = false;
                resizing = false;
                if (!$('settings').classList.contains('open'))
                    overlay.classList.add('pinned')
            }
            )
        }
        function updateDetectedPlayerDisplay() {
            ['', 'bj', 'race', 'slot', 'mines', 'deal', 'roulette'].forEach(prefix => {
                const nameBox = $(prefix === 'bj' ? 'bjDetectedPlayerName' : prefix === 'race' ? 'raceDetectedPlayerName' : prefix === 'slot' ? 'slotDetectedPlayerName' : prefix === 'mines' ? 'minesDetectedPlayerName' : prefix === 'deal' ? 'dealDetectedPlayerName' : prefix === 'roulette' ? 'rouletteDetectedPlayerName' : 'detectedPlayerName')
                    , idBox = $(prefix === 'bj' ? 'bjDetectedPlayerId' : prefix === 'race' ? 'raceDetectedPlayerId' : prefix === 'slot' ? 'slotDetectedPlayerId' : prefix === 'mines' ? 'minesDetectedPlayerId' : prefix === 'deal' ? 'dealDetectedPlayerId' : prefix === 'roulette' ? 'rouletteDetectedPlayerId' : 'detectedPlayerId');
                if (nameBox)
                    nameBox.textContent = autoName || 'Waiting for game data...';
                if (idBox)
                    idBox.textContent = autoUserId ? 'User ID: ' + autoUserId + ' • locked from game data' : 'Open in-game so the app can read your name and ID.'
            }
            );
            updateBankerUI();
        }
        function setTab(tab) {
            $('wheelPage').classList.toggle('active', tab === 'wheel');
            $('blackjackPage').classList.toggle('active', tab === 'blackjack');
            $('racingPage').classList.toggle('active', tab === 'racing');
            $('slotsPage').classList.toggle('active', tab === 'slots');
            $('minesPage').classList.toggle('active', tab === 'mines');
            $('dealPage').classList.toggle('active', tab === 'deal');
            $('roulettePage').classList.toggle('active', tab === 'roulette');
            $('crashPage').classList.toggle('active', tab === 'crash');
            $('chipsPage').classList.toggle('active', tab === 'chips');

            $('wheelTabButton').classList.toggle('active', tab === 'wheel');
            $('blackjackTabButton').classList.toggle('active', tab === 'blackjack');
            $('racingTabButton').classList.toggle('active', tab === 'racing');
            $('slotsTabButton').classList.toggle('active', tab === 'slots');
            $('MinesTabButton').classList.toggle('active', tab === 'mines');
            $('dealTabButton').classList.toggle('active', tab === 'deal');
            $('rouletteTabButton').classList.toggle('active', tab === 'roulette');
            $('crashTabButton').classList.toggle('active', tab === 'crash');
            $('chipsTabButton').classList.toggle('active', tab === 'chips');
        }

        const buttons = document.querySelectorAll(".tabButton");
        const indicator = document.querySelector(".tabIndicator");

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {

                document.querySelector(".tabButton.active")?.classList.remove("active");
                button.classList.add("active");

                if (button.innerHTML.toLowerCase().includes("wheel")) {
                    setTab("wheel")
                }
                else if (button.innerHTML.toLowerCase().includes("blackjack")) {
                    setTab("blackjack")
                }
                else if (button.innerHTML.toLowerCase().includes("racing")) {
                    setTab("racing")
                }
                else if (button.innerHTML.toLowerCase().includes("slots")) {
                    setTab("slots")
                }
                else if (button.innerHTML.toLowerCase().includes("mines")) {
                    setTab("mines")
                }
                else if (button.innerHTML.toLowerCase().includes("deal")) {
                    setTab("deal")
                }
                else if (button.innerHTML.toLowerCase().includes("roulette")) {
                    setTab("roulette")
                }
                else if (button.innerHTML.toLowerCase().includes("crash")) {
                    setTab("crash")
                }
                else if (button.innerHTML.toLowerCase().includes("chips")) {
                    setTab("chips");
                    loadDailyCasinoProfit();
                }

                MoveIndicator(button)
            });
        });

        function positionTabIndicator(button) {
            if (!button || !indicator || !scroller) return;

            const scrollerRect =
                scroller.getBoundingClientRect();

            const buttonRect =
                button.getBoundingClientRect();

            const left =
                buttonRect.left -
                scrollerRect.left;

            indicator.style.width =
                `${buttonRect.width}px`;

            indicator.style.transform =
                `translateX(${left}px)`;
        }

        function MoveIndicator(button) {
            if (!button || !indicator || !scroller) return;

            button.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });

            requestAnimationFrame(() => {
                positionTabIndicator(button);
            });

            setTimeout(() => {
                positionTabIndicator(button);
                updateArrows();
            }, 220);
        }
        let shownResultIds = new Set();
        let roundPopupTimer = null;

        function getRoundId(type, round) {
            return type + "_" + String(
                round?.spinId ||
                round?.roundId ||
                round?.raceId ||
                round?.id ||
                JSON.stringify(round?.results || [])
            );
        }


        let slotAudioUnlocked = false;

        function getSlotPayoutAudio() {
            const audio = $('slotPayoutSound');


            if (!audio) {
                console.error(
                    'slotPayoutSound element was not found'
                );

                return null;
            }

            audio.volume = 0.1;
            return audio;
        }

        function unlockSlotPayoutSound() {
            if (slotAudioUnlocked) return;

            const audio = getSlotPayoutAudio();
            if (!audio) return;

            const previousVolume = audio.volume;

            audio.volume = 0;
            audio.currentTime = 0;

            const playPromise = audio.play();

            if (
                playPromise &&
                typeof playPromise.then === 'function'
            ) {
                playPromise
                    .then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = previousVolume;
                        slotAudioUnlocked = true;
                    })
                    .catch(error => {
                        audio.volume = previousVolume;

                        console.error(
                            'Could not unlock slotmachine.mp3:',
                            error
                        );
                    });
            }
        }

        function playSlotPayoutSound() {
            const audio = getSlotPayoutAudio();
            if (!audio) return;

            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0.1;

            const playPromise = audio.play();

            if (
                playPromise &&
                typeof playPromise.catch === 'function'
            ) {
                playPromise.catch(error => {
                    console.error(
                        'Could not play slotmachine.mp3. ' +
                        'Make sure it is in the same hosted folder as the HTML:',
                        error
                    );
                });
            }
        }

        function showWinEffect() {
            const overlay = document.getElementById("winOverlay");

            overlay.classList.remove("active");
            void overlay.offsetWidth;
            overlay.classList.add("active");

            const colors = [
                "#ffd700",
                "#7c4dff",
                "#6ee77c",
                "#ff6262",
                "#ffffff"
            ];

            const totalPieces = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
            let created = 0;

            const confettiInterval = setInterval(() => {
                const piece = document.createElement("div");
                piece.className = "confetti";

                piece.style.left = Math.random() * 100 + "vw";
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];

                piece.style.animationDuration =
                    (2 + Math.random() * 3) + "s";

                piece.style.animationDelay =
                    Math.random() * 0.3 + "s";

                piece.style.width =
                    (6 + Math.random() * 8) + "px";

                piece.style.height =
                    (8 + Math.random() * 14) + "px";

                piece.style.transform =
                    `rotate(${Math.random() * 360}deg)`;

                document.body.appendChild(piece);

                setTimeout(() => {
                    piece.remove();
                }, 7000);

                created++;

                if (created >= totalPieces) {
                    clearInterval(confettiInterval);
                }

            }, 5);

            setTimeout(() => {
                overlay.classList.remove("active");
            }, 3000);
        }

        function maybeShowRoundResultPopup(type, round) {
            if (!round || !Array.isArray(round.results) || !round.results.length) return;

            const id = getRoundId(type, round);
            if (shownResultIds.has(id)) return;

            const banker = isBanker();
            const mine = round.results.find(r => String(r.playerId) === String(autoUserId));

            if (!banker && !mine) return;

            shownResultIds.add(id);
            showRoundResultPopup(type, round, mine);
        }

        function showRoundResultPopup(type, round, mine) {
            const popup = $("roundResultPopup");
            const title = $("roundResultTitle");
            const body = $("roundResultBody");
            const close = $("roundResultClose");

            const banker = isBanker();

            popup.classList.remove("hidden");

            if (roundPopupTimer) {
                clearTimeout(roundPopupTimer);
                roundPopupTimer = null;
            }

            close.style.display = banker ? "" : "none";

            if (banker) {
                title.textContent = "All Round Results";

                body.innerHTML = round.results.map(r => {
                    const profit = Number(r.profit || 0);
                    return `
                <div class="roundResultLine">
                    <span>
                        ${escapeHtml(r.playerName)}<br>
                        <span class="small">
                            ${type === "racing" ? `Horse ${escapeHtml(r.horseName || "")}` : `Bet ${shortMoney(r.amount)}${r.multiplier !== undefined ? ` • x${r.multiplier}` : ""}`}
                        </span>
                    </span>
                    <b class="${profit > 0 ? "win" : profit < 0 ? "loss" : "neutral"}">
                        ${profit >= 0 ? "+" : ""}${shortMoney(profit)}
                    </b>
                </div>
            `;
                }).join("");
            }

            if (!mine) {
                popup.classList.add("hidden");
                return;
            }

            const profit = Number(mine.profit || 0);
            const won = profit > 0;

            title.textContent = won ? "You Won!" : profit < 0 ? "You Lost" : "Break Even";

            body.innerHTML = `
        <div class="bigResult ${won ? "win" : profit < 0 ? "loss" : "neutral"}">
            ${profit >= 0 ? "+" : ""}${shortMoney(profit)}
        </div>
        <div class="subResult">
            ${type === "racing" ? `Horse ${escapeHtml(mine.horseName || "")}<br>` : ""}
            Bet ${shortMoney(mine.amount)}
            ${mine.multiplier !== undefined ? ` • Multiplier x${mine.multiplier}` : ""}<br>
            Payout ${shortMoney(mine.payout || 0)}
        </div>
    `;

            if (won) {
                showWinEffect();
            }

            roundPopupTimer = setTimeout(() => {
                popup.classList.add("hidden");
            }, 5000);
        }

        function hideRoundResultPopup() {
            $("roundResultPopup").classList.add("hidden");

            if (roundPopupTimer) {
                clearTimeout(roundPopupTimer);
                roundPopupTimer = null;
            }
        }

        const active = document.querySelector(".tabButton.active");
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.transform = `translateX(${active.offsetLeft}px)`;

        function extractGameData(message) {
            if (!message) return null;

            const candidates = [
                message,
                message.data,
                message.cache,
                message.payload,
                message.value,
                message.values,
                message.namedData,
                message.result,
                message.response
            ];

            for (const candidate of candidates) {
                if (
                    !candidate ||
                    typeof candidate !== 'object'
                ) {
                    continue;
                }

                const userId =
                    candidate.user_id ??
                    candidate.userId ??
                    candidate.userid ??
                    candidate.player_id ??
                    candidate.playerId ??
                    candidate.id;

                const playerName =
                    candidate.name ??
                    candidate.username ??
                    candidate.player_name ??
                    candidate.playerName ??
                    candidate.displayName;

                if (
                    userId !== undefined ||
                    playerName !== undefined
                ) {
                    return {
                        ...candidate,
                        user_id: userId,
                        name: playerName
                    };
                }
            }

            return null;
        }

        function applyGameData(data) {
            if (!data) return false;

            let changed = false;

            const rawId =
                data.user_id ??
                data.userId ??
                data.userid ??
                data.player_id ??
                data.playerId ??
                data.id;

            if (
                rawId !== undefined &&
                rawId !== null
            ) {
                const nextId = String(rawId).trim();

                if (
                    nextId &&
                    autoUserId !== nextId
                ) {
                    autoUserId = nextId;
                    changed = true;
                }
            }

            const rawName =
                data.name ??
                data.username ??
                data.player_name ??
                data.playerName ??
                data.displayName;

            if (
                rawName !== undefined &&
                rawName !== null
            ) {
                const nextName =
                    String(rawName).trim();

                if (
                    nextName &&
                    autoName !== nextName
                ) {
                    autoName = nextName;
                    changed = true;
                }
            }

            if (changed) {
                updateBankerUI();
                updateDetectedPlayerDisplay();
                render();
            }

            return changed;
        }

        function requestGameData() {
            try {
                window.parent.postMessage({ type: 'getData' }, '*');
                window.parent.postMessage({
                    type: 'getNamedData',
                    keys: [
                        'user_id',
                        'userId',
                        'playerId',
                        'name',
                        'username',
                        'playerName'
                    ]
                }, '*');
            } catch (e) { }
        }

        window.addEventListener('message', function (event) {
            applyGameData(extractGameData(event.data));
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeSettingsPanel();
                pinApp()
            }
        }
        );

        let scroller = document.getElementById("tabsScroller");
        let left = document.querySelector(".tabScroll.left");
        let right = document.querySelector(".tabScroll.right");

        function updateArrows() {
            if (!scroller || !left || !right) return;

            const maxScroll =
                Math.max(
                    0,
                    scroller.scrollWidth -
                    scroller.clientWidth
                );

            const canScroll = maxScroll > 2;

            left.classList.toggle(
                'hidden',
                !canScroll ||
                scroller.scrollLeft <= 2
            );

            right.classList.toggle(
                'hidden',
                !canScroll ||
                scroller.scrollLeft >=
                maxScroll - 2
            );

            const activeButton =
                document.querySelector(
                    '.tabButton.active'
                );

            if (activeButton && indicator) {
                positionTabIndicator(activeButton);
            }
        }

        function scrollTabs(direction) {
            if (!scroller) return;

            const firstButton =
                scroller.querySelector(
                    '.tabButton'
                );

            const step = firstButton
                ? firstButton.getBoundingClientRect().width
                : 108;

            scroller.scrollBy({
                left: direction * step * 2,
                behavior: 'smooth'
            });
        }

        window.addEventListener('load', function () {
            scroller = document.getElementById("tabsScroller");
            left = document.querySelector(".tabScroll.left");
            right = document.querySelector(".tabScroll.right");
            left.onclick = () => scrollTabs(-1);
            right.onclick = () => scrollTabs(1);
            scroller.addEventListener("scroll", updateArrows, { passive: true });
            window.addEventListener('resize', () => {
                updateArrows();

                const activeButton =
                    document.querySelector(
                        '.tabButton.active'
                    );

                if (activeButton) {
                    requestAnimationFrame(() => {
                        positionTabIndicator(activeButton);
                    });
                }
            });
            scroller.scrollLeft = 0;

            updateArrows();
            document.documentElement.style.background = 'transparent';
            document.body.style.background = 'transparent';
            document.body.style.backgroundColor = 'transparent';
            loadOverlayPosition();
            requestAnimationFrame(syncOverlayContentHeight);
            setupDragResize();
            loadOpacity();
            $("roulettePlaceBetButton")?.addEventListener(
            "click",
            () => {
                placeRouletteBet().catch(error => {
                    setStatus(
                        error.message ||
                        "Roulette bet failed",
                        4000
                    );
                });
            }
        );

        $("rouletteClearBetsButton")?.addEventListener(
            "click",
            () => {
                clearMyRouletteBets().catch(error => {
                    setStatus(
                        error.message ||
                        "Could not clear roulette bets",
                        4000
                    );
                });
            }
        );

        $("dealStartButton")?.addEventListener(
            "click",
            () => {
                startDealGame().catch(error => {
                    setStatus(
                        error.message || "Could not start game",
                        4000
                    );
                });
            }
        );

        $("dealAcceptButton")?.addEventListener(
            "click",
            () => {
                answerDealOffer(true).catch(error => {
                    setStatus(
                        error.message || "Could not accept deal",
                        4000
                    );
                });
            }
        );

        $("dealRejectButton")?.addEventListener(
            "click",
            () => {
                answerDealOffer(false).catch(error => {
                    setStatus(
                        error.message || "Could not reject deal",
                        4000
                    );
                });
            }
        );

        $("dealBetInput")?.addEventListener(
            "input",
            renderDealGame
        );

        const resetAllChipsButton =
            $("resetAllChipsButton");

        if (resetAllChipsButton) {
            resetAllChipsButton.addEventListener(
                "click",
                () => {
                    resetAllCasinoChips().catch(error => {
                        setStatus(
                            error.message || "Reset failed",
                            4000
                        );
                    });
                }
            );
        }

        enableMoneyInputs();
        buildWheelFace();
            updateDetectedPlayerDisplay();
            $('settings-icon').addEventListener('click', e => {
                toggleSettingsPanel();
                e.stopPropagation()
            }
            );
            window.addEventListener('resize', positionSettingsPanel);
            $('opacityInput').addEventListener('input', function () {
                applyOpacity(this.value)
            });
            $('reloadButton').addEventListener('click', () => window.location.reload());
            document.querySelectorAll('.quickBetButton').forEach(button => button.addEventListener('click', () => setBetAmount(button.dataset.target, Number(button.dataset.amount))));
            $('requestChipsButton').addEventListener('click', requestChips);
            $('grantChipsButton').addEventListener('click', () => grantChips());
            $('submitBetButton').addEventListener('click', submitBet);
            $('loginAdminButton').addEventListener('click', loginAdmin);
            $('confirmAllButton').addEventListener('click', () => adminAction('confirmAll'));
            $('spinButton').addEventListener('click', () => adminAction('spin'));
            $('clearRoundButton').addEventListener('click', () => adminAction('clearRound'));
            $('bjSubmitBetButton').addEventListener('click', bjSubmitBet);
            $('bjConfirmAllButton').addEventListener('click', () => adminAction('bjConfirm'));
            $('bjStartButton').addEventListener('click', () => adminAction('bjStart'));
            $('bjResetButton').addEventListener('click', () => adminAction('bjReset'));
            $('bjHitButton').addEventListener('click', () => bjPlayerAction('hit'));
            $('bjStandButton').addEventListener('click', () => bjPlayerAction('stand'));
            $('raceSubmitBetButton').addEventListener('click', raceSubmitBet);
            $('raceConfirmAllButton').addEventListener('click', () => adminAction('raceConfirm'));
            $('raceStartButton').addEventListener('click', () => adminAction('raceStart'));
            $('raceClearButton').addEventListener('click', () => adminAction('raceClear'));
            $('slotSpinButton').addEventListener(
                'pointerdown',
                unlockSlotPayoutSound
            );

            $('slotSpinButton').addEventListener(
                'click',
                slotSpin
            );
            $('minesStartButton').addEventListener('click', startMinesGame);
            $('minesCashoutButton').addEventListener('click', cashoutMines);
            MoveIndicator(document.querySelector(".tabButton.active"))
            $("roundResultClose").addEventListener("click", hideRoundResultPopup);
            $("cashoutChipsButton").addEventListener("click", cashoutPlayerChips);
            $("refreshDailyProfit").addEventListener(
                "click",
                () => loadDailyCasinoProfit(true)
            );

            window.addEventListener("resize", updateArrows);


            pinApp();
            requestGameData();
            const gameDataRetry = setInterval(() => {
                if (autoUserId && autoName) {
                    clearInterval(gameDataRetry);
                } else {
                    requestGameData();
                }
            }, 1500);
            setTimeout(() => clearInterval(gameDataRetry), 15000);
            startPolling();
            setInterval(updateAutomaticGameCountdowns, 250);
            render()
        });
    </script>
</body>

</html>
