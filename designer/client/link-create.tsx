import React, { useContext, useState } from "react";
import SelectConditions from "./conditions/SelectConditions";
import { ErrorMessage } from "@govuk-jsx/error-message";
import { clone } from "@xgovformbuilder/model";
import classNames from "classnames";

import ErrorSummary from "./error-summary";
import { DataContext } from "./context";
import { i18n } from "./i18n";
import { addLink } from "./data/page";
import logger from "../client/plugins/logger";

const LinkCreate = (props) => {
  const [selectedCondition, setSelectedCondition] = useState("");
  const { data, save } = useContext(DataContext);
  const [path, setPath] = useState(null);
  const [errors, setErrors] = useState({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { pages } = data;

  const onSubmit = async (e) => {
    e.preventDefault();
    const hasValidationErrors = validate();
    if (hasValidationErrors) return;

    const copy = { ...data };
    const { error, ...updatedData } = addLink(
      copy,
      from,
      to,
      selectedCondition
    );
    error && logger.error("LinkCreate", error);
    const savedData = await save(updatedData);
    props.onCreate({ data: savedData });
  };

  const conditionSelected = (selectedCondition) => {
    setSelectedCondition(selectedCondition);
  };

  const validate = () => {
    let errors = {};
    if (!from) {
      errors.from = { href: "#link-source", children: "Enter from" };
    }
    if (!to) {
      errors.to = { href: "#link-target", children: "Enter to" };
    }
    setErrors(errors);
    return !from || !to;
  };

  let hasValidationErrors = Object.keys(errors).length > 0;

  return (
    <>
      {hasValidationErrors && (
        <ErrorSummary errorList={Object.values(errors)} />
      )}
      <div className="govuk-hint">{i18n("addLink.hint1")}</div>
      <div className="govuk-hint">{i18n("addLink.hint2")}</div>
      <form onSubmit={(e) => onSubmit(e)} autoComplete="off">
        <div
          className={classNames({
            "govuk-form-group": true,
            "govuk-form-group--error": errors?.from,
          })}
        >
          <label className="govuk-label govuk-label--s" htmlFor="link-source">
            From
          </label>
          {errors?.from && <ErrorMessage>{errors?.from.children}</ErrorMessage>}
          <select
            className={classNames({
              "govuk-select": true,
              "govuk-input--error": errors?.from,
            })}
            id="link-source"
            data-testid="link-source"
            name="path"
            onChange={(e) => setFrom(e.target.value)}
          >
            <option />
            {pages.map((page) => (
              <option
                key={page.path}
                value={page.path}
                data-testid="link-source-option"
              >
                {page.title}
              </option>
            ))}
          </select>
        </div>

        <div
          className={classNames({
            "govuk-form-group": true,
            "govuk-form-group--error": errors?.to,
          })}
        >
          <label className="govuk-label govuk-label--s" htmlFor="link-target">
            To
          </label>
          {errors?.to && <ErrorMessage>{errors?.to.children}</ErrorMessage>}
          <select
            className={classNames({
              "govuk-select": true,
              "govuk-input--error": errors?.to,
            })}
            id="link-target"
            data-testid="link-target"
            name="page"
            onChange={(e) => setTo(e.target.value)}
          >
            <option />
            {pages.map((page) => (
              <option
                key={page.path}
                value={page.path}
                data-testid="link-target-option"
              >
                {page.title}
              </option>
            ))}
          </select>
        </div>

        {from && from.trim() !== "" && (
          <SelectConditions
            path={from}
            conditionsChange={conditionSelected}
            noFieldsHintText={i18n("addLink.noFieldsAvailable")}
          />
        )}

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    </>
  );
};

export default LinkCreate;
