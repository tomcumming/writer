const STATE_KEY = "writing-state";

export type State = {
  previousText: string;
};

const emptyState: State = {
  previousText: "",
};

export function load(): State {
  const json = self.localStorage.getItem(STATE_KEY);
  return json === null ? emptyState : JSON.parse(json);
}

export function save(state: State) {
  self.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}
