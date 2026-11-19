import { useState } from 'react'
import {toast} from 'react-hot-toast'
import Panel from './ui/Panel'
import Button from './ui/Button'
import Input from './ui/Input'
import BackIcon from '../icons/BackIcon'
import { questionApi } from '../api/questions'

const INITIAL_FORM = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A'
};

export default function AddQuestionModal({ quizId, isOpen, onClose, onQuestionCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const options = [form.option_a?.trim(), 
    form.option_b?.trim(), 
    form.option_c?.trim(), 
    form.option_d?.trim()
    ]
    if(new Set(options).size !== options.length){toast.error('All the options must be unique');return;}
    setSubmitting(true);
    try {
      const response = await questionApi.add(quizId, form);
      // Pass the newly created question back up to update the list immediately
      onQuestionCreated(response.question)
      setForm(INITIAL_FORM);
      onClose();
    } catch(err){
    	console.error(err)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Panel tone="solid" className="relative flex w-[90vw] max-w-lg flex-col gap-3">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 cursor-pointer text-slate-400 hover:text-white"
          type="button"
        >
          <BackIcon />
        </button>

        <div className="text-center font-bold">Adding a new question</div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            value={form.question_text}
            name="question_text"
            placeholder="Enter question text here"
            required
            onChange={handleChange}
          />
          <Input
            value={form.option_a}
            name="option_a"
            placeholder="Enter option A"
            required
            onChange={handleChange}
          />
          <Input
            value={form.option_b}
            name="option_b"
            placeholder="Enter option B"
            required
            onChange={handleChange}
          />
          <Input
            value={form.option_c}
            name="option_c"
            placeholder="Enter option C"
            required
            onChange={handleChange}
          />
          <Input
            value={form.option_d}
            name="option_d"
            placeholder="Enter option D"
            required
            onChange={handleChange}
          />

          <div className="flex items-center justify-between gap-3 p-1">
            <label htmlFor="selector" className="text-sm text-slate-300">
              Select the correct option here:
            </label>
            <select
              id="selector"
              name="correct_option"
              className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 outline-none"
              value={form.correct_option}
              onChange={handleChange}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Saving...' : 'Done'}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
