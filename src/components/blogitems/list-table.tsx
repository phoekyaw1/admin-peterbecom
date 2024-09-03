import { Badge, Button, Highlight, Table, TextInput } from "@mantine/core";
import type { BadgeProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { formatDistance, isBefore, parseISO } from "date-fns";
import { useState } from "react";

import { Link } from "wouter";
import type { BlogitemsServerData } from "../../types";

export function ListTable({
  search,
  data,
  updateSearch,
}: {
  search: string;
  data: BlogitemsServerData;
  updateSearch: (s: string) => void;
}) {
  const [value, setValue] = useState(search);

  function toggleCategory(name: string) {
    const newSearch = /\s/.test(name)
      ? `category:"${name}"`
      : `category:${name}`;

    if (search.includes(newSearch)) {
      setValue((v) => v.replace(newSearch, ""));
      updateSearch(search.replace(newSearch, ""));
    } else {
      setValue((v) => `${v} ${newSearch}`.trim());
      updateSearch(`${search} ${newSearch}`.trim());
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSearch(value.trim());
      }}
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Modified</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <TextInput
                placeholder="Search"
                aria-label="Search"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                radius="xl"
                rightSection={<IconSearch />}
              />
            </Table.Td>
            <Table.Th>
              {search && (
                <Button
                  onClick={() => {
                    setValue("");
                    updateSearch("");
                  }}
                >
                  Clear
                </Button>
              )}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.blogitems.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>
                <Link href={`/plog/${item.oid}`}>
                  {search ? (
                    <Highlight highlight={search} component="span">
                      {item.title}
                    </Highlight>
                  ) : (
                    item.title
                  )}
                </Link>

                {item.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="light"
                    color="gray"
                    ml={5}
                    style={{ textTransform: "none", pointer: "cursor" }}
                    onClick={() => {
                      toggleCategory(category.name);
                    }}
                  >
                    {category.name}
                  </Badge>
                ))}

                {!item.summary && (
                  <CustomBadge
                    variant="default"
                    ml={15}
                    style={{ textTransform: "none" }}
                  >
                    No summary
                  </CustomBadge>
                )}

                {item.archived && (
                  <CustomBadge color="red">Archived</CustomBadge>
                )}

                {!item._is_published ? (
                  <CustomBadge color="orange">
                    Published <DisplayDate date={item.pub_date} />
                  </CustomBadge>
                ) : null}
              </Table.Td>
              <Table.Td>{item.modify_date}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </form>
  );
}

function CustomBadge(props: BadgeProps) {
  return <Badge ml={15} style={{ textTransform: "none" }} {...props} />;
}

export function DisplayDate({
  date,
  now,
  prefix,
}: {
  date: string;
  now?: string;
  prefix?: string;
}) {
  prefix = prefix || "in";
  if (date === null) {
    throw new Error("date is null");
  }
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const nowObj = now ? parseISO(now) : new Date();
  if (isBefore(dateObj, nowObj)) {
    return (
      <span title={dateObj.toString()}>
        {formatDistance(dateObj, nowObj)} ago
      </span>
    );
  }
  return (
    <span title={dateObj.toString()}>
      {prefix} {formatDistance(dateObj, nowObj)}
    </span>
  );
}