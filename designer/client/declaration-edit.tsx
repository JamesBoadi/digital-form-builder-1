import React, { useContext, useState } from "react";
import Editor from "./editor";
import { clone } from "@xgovformbuilder/model";

import { DataContext } from "./context";
import logger from "../client/plugins/logger";

const DeclarationEdit = (props) => {
  const { data, save } = useContext(DataContext);
  const { declaration, skipSummary } = data;

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new window.FormData(form);
    const { toggleShowState } = props;
    const copy = clone(data);

    copy.declaration = formData.get("declaration");
    copy.skipSummary = formData.get("skip-summary") === "on";

    try {
      const savedData = await save(copy);
      props.onCreate({ data: savedData });
    } catch {
      logger.error("DeclarationEdit", err);
    }
  };

  return (
    <div className="govuk-body">
      <form onSubmit={(e) => onSubmit(e)} autoComplete="off">
        <div className="govuk-checkboxes govuk-form-group">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <p className="govuk-fieldset__heading">Skip summary page? </p>
            <span className="govuk-hint">
              The user will not be shown a summary page, and will continue to
              pay and/or the application complete page.
            </span>
          </legend>
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="skip-summary"
              data-cast="boolean"
              name="skip-summary"
              type="checkbox"
              defaultChecked={skipSummary}
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="skip-summary"
            >
              Skip summary
            </label>
          </div>
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="declaration">
            Declaration
          </label>
          <span className="govuk-hint">
            The declaration can include HTML and the `govuk-prose-scope` css
            class is available. Use this on a wrapping element to apply default
            govuk styles.
          </span>
          <Editor name="declaration" value={declaration} />
        </div>

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default DeclarationEdit;