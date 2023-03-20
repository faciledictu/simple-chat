// import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useRollbar } from '@rollbar/react';
import { object, string } from 'yup';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import useAuth from '../hooks/useAuth.js';
import useServer from '../hooks/useServer.js';
import useAutoFocus from '../hooks/useAutoFocus.js';

const MessageForm = ({ channelId }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { sendMessage } = useServer();
  const { userId } = useAuth();
  const messageInputRef = useAutoFocus();

  const validationSchema = object({
    body: string()
      .trim()
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async ({ body }) => {
      const message = {
        body,
        username: userId.username,
        channelId,
      };
      try {
        await sendMessage(message);
        formik.resetForm();
      } catch (error) {
        toast.error(t('errors.noConnection'));
        rollbar.error('MessageForm#sending', error);
      } finally {
        messageInputRef.current.focus();
      }
    },
  });

  return (
    <Form className="p-3" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          name="body"
          value={formik.values.body}
          placeholder={t('chat.writeMessage')}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
          aria-label={t('chat.newMessage')}
          className="ps-3 pe-5 rounded-pill w-100"
          autoComplete="off"
          ref={messageInputRef}
        />
        <Button
          type="submit"
          disabled={formik.isSubmitting || formik.errors.body}
          className="border-0 rounded-circle p-0 m-1 position-absolute end-0"
          style={{ zIndex: 5 }}
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" width={30} height={30}>
            <path d="M7.16,6.59v6.83a.51.51,0,0,0,.48.51l11.17.78a.29.29,0,0,1,0,.58l-11.17.78a.51.51,0,0,0-.48.51v6.83a.5.5,0,0,0,.72.46l19-8.6a.3.3,0,0,0,0-.54l-19-8.6A.5.5,0,0,0,7.16,6.59Z" />
          </svg>
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
