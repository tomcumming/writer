import "./components/tts";
import App from "./components/app";
import { createElement, render } from "preact";

// Get them ready
self.speechSynthesis.getVoices();

render(createElement(App, {}), document.body);
